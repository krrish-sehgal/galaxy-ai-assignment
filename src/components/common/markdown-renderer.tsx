import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import type { Components } from "react-markdown";
import "highlight.js/styles/github-dark.css";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({
  content,
  className = "",
}: MarkdownRendererProps) {
  const components: Components = {
    // Headings
    h1: ({ children }) => (
      <h1 className="text-2xl font-bold text-zinc-100 mb-4 mt-6 first:mt-0">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-xl font-semibold text-zinc-100 mb-3 mt-5 first:mt-0">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-lg font-semibold text-zinc-100 mb-2 mt-4 first:mt-0">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="text-base font-semibold text-zinc-100 mb-2 mt-3 first:mt-0">
        {children}
      </h4>
    ),
    h5: ({ children }) => (
      <h5 className="text-sm font-semibold text-zinc-100 mb-2 mt-3 first:mt-0">
        {children}
      </h5>
    ),
    h6: ({ children }) => (
      <h6 className="text-sm font-semibold text-zinc-100 mb-2 mt-3 first:mt-0">
        {children}
      </h6>
    ),

    // Paragraphs
    p: ({ children }) => (
      <p className="text-zinc-100 leading-relaxed mb-4 last:mb-0">{children}</p>
    ),

    // Lists
    ul: ({ children }) => (
      <ul className="text-zinc-100 leading-relaxed mb-4 ml-4 space-y-1 list-disc list-outside">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="text-zinc-100 leading-relaxed mb-4 ml-4 space-y-1 list-decimal list-outside">
        {children}
      </ol>
    ),
    li: ({ children }) => (
      <li className="text-zinc-100 leading-relaxed">{children}</li>
    ),

    // Emphasis
    strong: ({ children }) => (
      <strong className="font-semibold text-zinc-50">{children}</strong>
    ),
    em: ({ children }) => <em className="italic text-zinc-200">{children}</em>,

    // Code
    code: ({ children, className, ...props }) => {
      const match = /language-(\w+)/.exec(className || "");
      const isInline = !match;

      if (isInline) {
        return (
          <code className="bg-zinc-800 text-zinc-200 px-1.5 py-0.5 rounded text-sm font-mono">
            {children}
          </code>
        );
      }
      return (
        <code className={`${className || ""} text-sm`} {...props}>
          {children}
        </code>
      );
    },
    pre: ({ children }) => (
      <pre className="bg-zinc-900 border border-zinc-700 rounded-lg p-4 mb-4 overflow-x-auto">
        {children}
      </pre>
    ),

    // Blockquotes
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-zinc-600 pl-4 py-2 mb-4 text-zinc-300 italic bg-zinc-800/30 rounded-r">
        {children}
      </blockquote>
    ),

    // Links
    a: ({ href, children }) => (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-400 hover:text-blue-300 underline transition-colors"
      >
        {children}
      </a>
    ),

    // Tables
    table: ({ children }) => (
      <div className="overflow-x-auto mb-4">
        <table className="min-w-full border border-zinc-700 rounded-lg overflow-hidden">
          {children}
        </table>
      </div>
    ),
    thead: ({ children }) => <thead className="bg-zinc-800">{children}</thead>,
    tbody: ({ children }) => (
      <tbody className="bg-zinc-900/50">{children}</tbody>
    ),
    tr: ({ children }) => (
      <tr className="border-b border-zinc-700">{children}</tr>
    ),
    th: ({ children }) => (
      <th className="px-4 py-2 text-left text-zinc-200 font-semibold">
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="px-4 py-2 text-zinc-300">{children}</td>
    ),

    // Horizontal rule
    hr: () => <hr className="border-zinc-700 my-6" />,
  };

  return (
    <div className={`markdown-content ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
