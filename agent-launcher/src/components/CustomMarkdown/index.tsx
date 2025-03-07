import { useMemo } from "react";
import Markdown, { Components } from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import GeneralCode from "./GenerateCode";
import DeepThinking from "./DeepThinking";
import { CustomComponentProps } from "./types";
import { THINK_TAG_REGEX } from "./constants";
import CustomLink from "./Link";

const preprocessMarkdown = (content: string) => {
  try {
    const result = content?.replace?.(
      THINK_TAG_REGEX,
      (_, innerText) =>
        `<think>${innerText.trim().replace(/\n/g, "<br />")}</think>`
    );

    return result;
  } catch (error) {
    return "";
  }
};

type ComponentExtended = {
  code?: (props: CustomComponentProps) => JSX.Element;
  think?: (props: CustomComponentProps) => JSX.Element;
};

function CustomMarkdown({
  content,
  components = {},
  isLight = true,
  removeThink = false,
}: {
  content: string;
  components?: ComponentExtended;
  isLight?: boolean;
  removeThink?: boolean;
}) {
  const customComponents = useMemo(() => {
    return {
      code: (props: any) => {
        return <GeneralCode {...props} />;
      },
      think: (props: any) => {
        return (
          <DeepThinking
            {...props}
            isLight={isLight}
            removeThink={removeThink}
          />
        );
      },
      a: (props) => {
        return <CustomLink {...props} />;
      },
      ...components,
    } satisfies any;
  }, [components, isLight, removeThink]);

  const children = useMemo(() => preprocessMarkdown(content), [content]);

  return (
    <Markdown
      remarkPlugins={[remarkGfm]} // Enables GitHub Flavored Markdown
      rehypePlugins={[rehypeRaw]} // Enables raw HTML parsing
      children={children}
      components={customComponents as Components}
    />
  );
}

export default CustomMarkdown;
