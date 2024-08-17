import Editor from "@monaco-editor/react";

type OwnProps = {
  value: string;
  onChange: (newValue: string) => void;
};

const CodeEditor = ({ value, onChange }: OwnProps) => {
  return (
    <Editor
      theme="vs-dark"
      height="90vh"
      defaultLanguage="python"
      defaultValue="# some comment"
      value={value}
      onChange={(newValue) => onChange(newValue!)}
    />
  );
};

export default CodeEditor;
