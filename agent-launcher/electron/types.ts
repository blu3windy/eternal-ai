export type CodeLanguage = "js" | "py" | "custom-prompt" | "custom-ui"

export type OsContext = {
   memory: {
        total: number;
        free: number;
        used: number;
   },
}