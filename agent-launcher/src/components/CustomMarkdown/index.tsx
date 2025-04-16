import { useMemo, useState, memo } from "react";
import Markdown, { Components } from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import remarkBreaks from 'remark-breaks'
import GeneralCode from "./GenerateCode";
import CustomLink from "./Link";
import ContentReplay from "./Content";
import { FILES_TAG_REGEX, IFRAME_LINK_DATA_REGEX, IMAGE_SLIDER_TAG_REGEX, MARKDOWN_TAGS, THINK_TAG_REGEX } from "./constants";
import DeepThinking from "./DeepThinking";
// import { MSG_WITH_IMAGE_SLIDER } from "./test";
import ImageSlider from "./ImageSlider";
import Files from "./Files";
// import { MSG_WITH_FILES, MSG_WITH_IMAGE_LINK, MSG_WITH_IMAGE_SLIDER, THINK_TAG_MOCKUP } from "./test";
import IframeLink from "./IframeLink";

const preprocessMarkdown = (content: string) => {
   try {
      const result = content
         ?.replace?.(
            IMAGE_SLIDER_TAG_REGEX,
            (_, innerText) =>
               `<${MARKDOWN_TAGS.IMAGE_SLIDER}>${innerText.trim().replace(/\n/g, "")}</${MARKDOWN_TAGS.IMAGE_SLIDER}>`)
         ?.replace?.(
            FILES_TAG_REGEX,
            (_, innerText) =>
               `<${MARKDOWN_TAGS.FILES}>${innerText.trim().replace(/\n/g, "")}</${MARKDOWN_TAGS.FILES}>`)
         ?.replace?.(
            IFRAME_LINK_DATA_REGEX,
            (_, innerText) =>
               `<${MARKDOWN_TAGS.IFRAME_LINK}>${innerText.trim().replace(/\n/g, "")}</${MARKDOWN_TAGS.IFRAME_LINK}>`);
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
   const processedContent = useMemo(() => preprocessMarkdown(content), [content]);
   const thinkTag = useMemo(() => {
      try {
         return processedContent.match(THINK_TAG_REGEX)?.[0]?.replace(/<\/?think>/g, '');
      } catch (error) {
         return null;
      }
   }, [processedContent]);

   const contentWithoutThinkTag = useMemo(() => {
      try {
         return processedContent.replace(THINK_TAG_REGEX, "");
      } catch (error) {
         return null;
      }
   }, [processedContent]);

   const customComponents = useMemo(() => {
      return {
         code: (props: any) => {
            return <GeneralCode  {...props} key={id} />;
         },
         a: (props) => {
            return <CustomLink {...props}  key={id}/>;
         },
         p: (props) => {
            return <ContentReplay {...props} key={id}/>;
         },
         ['image-slider']: (props) => {
            return <ImageSlider {...props} key={id}/>;
         },
         ['files']: (props) => {
            return <Files {...props} key={id}/>;
         },
         ['iframe-link']: (props) => {
            return <IframeLink {...props} key={id}/>;
         }
      } satisfies any;
   }, []);

   return (
      <>
         {!!thinkTag && <DeepThinking content={thinkTag} status={status} />}
         <div
            style={{
               width: 'calc(calc(100vw / 2) * 0.8)'
            }}
         >
            <Markdown
               remarkPlugins={[remarkGfm, remarkBreaks]} // Enables GitHub Flavored Markdown
               rehypePlugins={[rehypeRaw]} // Enables raw HTML parsing
               children={contentWithoutThinkTag}
               components={customComponents as Components}
               urlTransform={(value: string) => value}
            />
         </div>
      </>
   );
}

export default memo(CustomMarkdown);

