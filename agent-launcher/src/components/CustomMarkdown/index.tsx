import { useMemo, useState, memo } from "react";
import Markdown, { Components } from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import remarkBreaks from 'remark-breaks'
import GeneralCode from "./GenerateCode";
import CustomLink from "./Link";
import ContentReplay from "./Content";
import { THINK_TAG_REGEX } from "./constants";
import DeepThinking from "./DeepThinking";


// const THINK_TASK_MOCKUP = `<think>
//   <task>{"id":"analysis1","type":"initial", "typeLabel": "Initial", "content":"Starting code analysis","result":"Beginning review of the codebase"}</task>
// <task>{"id":"analysis1","type":"progress", "typeLabel": "Progress", "content":"Analyzing component structure","result":"Identified main components: DeepThinking, Task, and CustomMarkdown"}</task>
// <task>{"id":"analysis1","type":"conclusion","content":"Finalizing analysis Starting code analysis Starting code analysis Starting code analysis √","result":"Found 3 key components with proper type definitions Finalizing analysis Starting code analysis Starting code analysis Starting code analysis √"}</task>

// <task>{"id":"search1","type":"searching","content":"Searching for type definitions","result":"Looking for TaskType interface"}</task>
// <task>{"id":"search1","type":"searching","content":"Found TaskType definition","result":"Located in Task/index.tsx with 4 required properties"}</task>
// <task>{"id":"search1","type":"searching","content":"Type analysis complete","result":"Verified all required properties: id, type, content, result"}</task>

// <task>{"id":"fix1","type":"getting","content":"Preparing to fix type error","result":"Identified missing id property in TaskType"}</task>
// <task>{"id":"fix1","type":"getting","content":"Adding id property","result":"Updated TaskType interface with id: string"}</task>
// <task>{"id":"fix1","type":"getting","content":"Type error resolved","result":"Successfully fixed TaskType definition"}</task>

// <task>{"id":"test1","type":"listting","content":"Testing task merging","result":"Creating multiple tasks with same IDs"}</task>
// <task>{"id":"test1","type":"listting","content":"Verifying merge functionality","result":"Tasks with same ID should combine their properties"}</task>
// <task>{"id":"test1","type":"listting","content":"Merge test complete","result":"Successfully demonstrated task merging"}</task>

// <task>{"id":"ui1","type":"initial","content":"Reviewing UI components","result":"Examining DeepThinking component structure"}</task>
// <task>{"id":"ui1","type":"progress","content":"Analyzing expand/collapse","result":"Found expandable section with chevron animation"}</task>
// <task>{"id":"ui1","type":"conclusion","content":"UI analysis complete","result":"Component has proper expand/collapse functionality"}</task>
// </think>`;

// const THINK_TAG_MOCKUP = `${THINK_TASK_MOCKUP}
// 🔄 Starting attempt 1... I have 2 tools available (like search, read_webpage). I can try up to 10 times.
// ❌ Oops! Something went wrong on attempt 1: Connection error.
// 🔄 Starting attempt 2... I have 2 tools available (like search, read_webpage). I can try 9 more times if needed.
// ❌ Oops! Something went wrong on attempt 2: Connection error.
// 🔄 Starting attempt 3... I have 2 tools available (like search, read_webpage). I can try 8 more times if needed.
// ❌ Oops! Something went wrong on attempt 3: Connection error.
// 🔄 Starting attempt 4... I have 2 tools available (like search, read_webpage). I can try 7 more times if needed.
// ❌ Oops! Something went wrong on attempt 4: Connection error.
// 🔄 Starting attempt 5... I have 2 tools available (like search, read_webpage). I can try 6 more times if needed.
// ❌ Oops! Something went wrong on attempt 5: Connection error.
// 🔄 Starting attempt 6... I have 2 tools available (like search, read_webpage). I can try 5 more times if needed.
// ❌ Oops! Something went wrong on attempt 6: Connection error.
// 🔄 Starting attempt 7... I have 2 tools available (like search, read_webpage). I can try 4 more times if needed.
// ❌ Oops! Something went wrong on attempt 7: Connection error.
// 🔄 Starting attempt 8... I have 2 tools available (like search, read_webpage). I can try 3 more times if needed.
// ❌ Oops! Something went wrong on attempt 8: Connection error.
// 🔄 Starting attempt 9... I have 2 tools available (like search, read_webpage). I can try 2 more times if needed.
// ❌ Oops! Something went wrong on attempt 9: Connection error.
// 🔄 Starting attempt 10... I have 2 tools available (like search, read_webpage). I can try 1 more times if needed.
// ❌ Oops! Something went wrong on attempt 10: Connection error.{"type":"error","error":"Connection error."}`

function CustomMarkdown({
   id,
   content,
   status = "waiting",
}: {
   id?: string;
   content: string;
   status?: string;
}) {
   const thinkTag = useMemo(() => {
      try {
         return content.match(THINK_TAG_REGEX)?.[0]?.replace(/<\/?think>/g, '');
      } catch (error) {
         return null;
      }
   }, [content]);

   const contentWithoutThinkTag = useMemo(() => {
      try {
         return content.replace(THINK_TAG_REGEX, "");
      } catch (error) {
         return null;
      }
   }, [content]);

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
      } satisfies any;
   }, []);

   return (
      <>
         {!!thinkTag && <DeepThinking content={thinkTag} status={status} />}
         <Markdown
            remarkPlugins={[remarkGfm, remarkBreaks]} // Enables GitHub Flavored Markdown
            rehypePlugins={[rehypeRaw]} // Enables raw HTML parsing
            children={contentWithoutThinkTag}
            components={customComponents as Components}
            urlTransform={(value: string) => value}
         />
      </>
   );
}

export default memo(CustomMarkdown);
