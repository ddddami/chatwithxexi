import Markdown from "react-markdown";

type Props = {
  content: string;
};

export default function FormatMarkdown({ content }: Props) {
  return (
    <div>
      <Markdown>{content}</Markdown>
    </div>
  );
}
