import { useMemo, useState, memo } from "react";
import Markdown, { Components } from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import remarkBreaks from 'remark-breaks'
import GeneralCode from "./GenerateCode";
import DeepThinking from "./DeepThinking";
import { THINK_TAG_REGEX } from "./constants";
import CustomLink from "./Link";
import ContentReplay from "./Content";
import Processing from "./Processing";

const preprocessMarkdown = (content: string) => {
   try {
      const result = content?.replace?.(THINK_TAG_REGEX, (_, innerText) => `<think>${innerText.trim()}</think>`);

      return result;
   } catch (error) {
      return "";
   }
};


function CustomMarkdown({
   id,
   content,
   status = "waiting",
}: {
   id?: string;
   content: string;
   status?: string;
}) {
   const children = useMemo(() => preprocessMarkdown(content), [content]);
   const thinkTag = useMemo(() => {
      try {
         return children?.match?.(THINK_TAG_REGEX)?.[0]?.replace?.(/<\/?think>/g, '');
      } catch (error) {
         return null;
      }
   }, [children]);
   
   const customComponents = useMemo(() => {
      return {
         code: (props: any) => {
            return <GeneralCode  {...props} key={id} />;
         },
         think: (props: any) => {
            return <DeepThinking {...props} key={id} status={status} thinkTag={thinkTag} />;
         },
         a: (props) => {
            return <CustomLink {...props}  key={id}/>;
         },
         p: (props) => {
            return <ContentReplay {...props} key={id}/>;
         },
         processing: (props: any) => {
            return <Processing {...props} key={id}/>;
         },
      } satisfies any;
   }, [status, thinkTag]);

   return (
      <Markdown
         remarkPlugins={[remarkGfm, remarkBreaks]} // Enables GitHub Flavored Markdown
         rehypePlugins={[rehypeRaw]} // Enables raw HTML parsing
         children={children}
         components={customComponents as Components}
         urlTransform={(value: string) => value}
      />
   );
}

export default memo(CustomMarkdown);
