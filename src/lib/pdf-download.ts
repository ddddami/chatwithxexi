import fs from "fs";
import os from "os";
import path from "path";
import admin, { ServiceAccount } from "firebase-admin";

const serviceAccount = JSON.parse(
  process.env.FIREBASE_SERVICE_ACCOUNT as string
) as ServiceAccount;

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  console.log("Initializing Firebase Admin SDK...");
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as ServiceAccount),
    storageBucket: "chatwithxexi.appspot.com",
  });
}

const bucket = admin.storage().bucket();

export async function downloadFile(srcFilename: string) {
  try {
    const tempDir = os.tmpdir();
    const file = bucket.file(srcFilename);
    const fileStream = file.createReadStream();
    const fileBuffer: any[] = [];
    const fileName = path.join(tempDir, `pdf-${Date.now()}.pdf`);

    return new Promise((resolve, reject) => {
      fileStream.on("data", (chunk: any) => fileBuffer.push(chunk));
      fileStream.on("end", () => {
        try {
          fs.writeFileSync(fileName, Buffer.concat(fileBuffer));
          console.log(`File downloaded and saved to ${fileName}`);
          resolve(fileName);
        } catch (error) {
          reject(error);
        }
      });
      fileStream.on("error", (error: any) => reject(error));
    });
  } catch (error: any) {
    console.error("Error downloading file:", error.message);
    return null;
  }
}
