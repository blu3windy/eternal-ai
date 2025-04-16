export const THINK_TAG_REGEX = /<think>([\s\S]*?)(?:<\/think>|$)/g;
export const COMPUTER_USE_TAG_REGEX = /<computer-use>([\s\S]*?)<\/computer-use>/g;
export const TASK_TAG_REGEX = /<task>([\s\S]*?)<\/task>/g;
export const IMAGE_SLIDER_TAG_REGEX = /<image-slider>([\s\S]*?)(?:<\/image-slider>|$)/g

export const IMAGE_SLIDE_ITEM_TAG_REGEX = /<slide-item>([\s\S]*?)(?:<\/slide-item>|$)/g

export const FILES_TAG_REGEX = /<files>([\s\S]*?)(?:<\/files>|$)/g
export const FILE_TAG_REGEX = /<file>([\s\S]*?)(?:<\/file>|$)/g
export const FILE_NAME_REGEX = /<filename>([\s\S]*?)(?:<\/filename>|$)/g
export const FILE_DATA_REGEX = /<filedata>([\s\S]*?)(?:<\/filedata>|$)/g

// export const IMAGE_LINK_DATA_REGEX = /<image-link>([\s\S]*?)(?:<\/image-link>|$)/g
export const IFRAME_LINK_DATA_REGEX = /<iframe-link>([\s\S]*?)(?:<\/iframe-link>|$)/g

export const TOOL_CALL_TAG_REGEX = /<tool-call>([\s\S]*?)(?:<\/tool-call>|$)/g


export const MARKDOWN_TAGS = {
   THINK: 'think',
   COMPUTER_USE: 'computer-use',
   TASK: 'task',
   IMAGE_SLIDER: 'image-slider',

   // Files
   FILES: 'files',
   FILE: 'file',
   FILE_NAME: 'filename',
   FILE_DATA: 'filedata',

   IFRAME_LINK: 'iframe-link'
}