import { Pinecone } from "@pinecone-database/pinecone";
import { config } from "dotenv";
import { downloadFile } from "./pdf-download";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import md5 from "md5";
import {
  Document,
  RecursiveCharacterTextSplitter,
} from "@pinecone-database/doc-splitter";
import { getEmbeddings } from "./embeddings";
import { Vector } from "@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/data";
import { convertToAscii } from "./utils";
config({ path: ".env" });

if (!process.env.PINECONE_API_KEY) {
  throw new Error("Pinecone API key is required.");
}

export const getPineconeClient = async () => {
  try {
    if (!process.env.PINECONE_API_KEY) {
      throw new Error("Open AI api key is required.");
    }
    const pc = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY,
    });
    return pc;
  } catch (error) {
    console.log("Error getting pinecone client");
  }
};

type PDFPage = {
  pageContent: string;
  metadata: {
    loc: { pageNumber: number };
  };
};

export async function loadPdfIntoPinecone(fileKey: string) {
  const file_name = await downloadFile(fileKey);
  if (!file_name) {
    throw new Error("Could not download resource from Firebase");
  }
  const loader = new PDFLoader(file_name as string);
  const pages = [await loader.load()] as unknown as PDFPage[][];

  // Split and segment pdf
  const documents = await Promise.all(pages[0].map(prepareDocument));

  // Vectorise and embed documents
  const vectors = await Promise.all(documents.flat().map(embedDocument));

  // Upload to pinecone
  const client = await getPineconeClient();
  if (!client) {
    throw new Error("Pinecone client cannot be found.");
  }

  const pineconeIndex = client.index("chatwithxexi");

  const namespaceId = convertToAscii(fileKey);

  // Upsert vectors to pinecone in chunks
  await chunkedUpsert(pineconeIndex, vectors, namespaceId, 10);

  console.log("Successfully uploaded vectors in chunks...");
  return documents[0];
}

async function embedDocument(doc: Document) {
  try {
    const embeddings = await getEmbeddings(doc.pageContent);
    const hash = md5(doc.pageContent);

    return {
      id: hash,
      values: embeddings,
      metadata: {
        text: doc.metadata.text,
        pageNumber: doc.metadata.pageNumber,
      },
    } as Vector;
  } catch (error) {
    console.log("Error embedding document", error);
    throw error;
  }
}

export const truncateStringByBytes = (str: string, bytes: number) => {
  const enc = new TextEncoder();
  return new TextDecoder("utf-8").decode(enc.encode(str)).slice(0, bytes);
};

async function prepareDocument(page: PDFPage) {
  try {
    let { pageContent, metadata } = page;
    pageContent.replace("/\n/g", "");

    const splitter = new RecursiveCharacterTextSplitter();
    const docs = await splitter.splitDocuments([
      new Document({
        pageContent,
        metadata: {
          pageNumber: metadata.loc.pageNumber,
          text: truncateStringByBytes(pageContent, 36000),
        },
      }),
    ]);
    return docs;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function chunkedUpsert(
  pineconeIndex: any,
  vectors: Vector[],
  namespaceId: string,
  CHUNK_SIZE: number
) {
  try {
    const namespace = pineconeIndex.namespace(namespaceId);
    for (let i = 0; i < vectors.length; i += CHUNK_SIZE) {
      const chunk = vectors.slice(i, i + CHUNK_SIZE);
      await namespace.upsert(chunk);
    }
  } catch (error) {
    console.log("Error upserting vectors in chunks to pinecone", error);
    throw error;
  }
}
