export interface LogEntry {
    type: "output" | "error";
    cmd?: string;
    message: string;
    timestamp: number;
} 