export interface DeepLinkParams {
    url: string;
    params: Record<string, string>;
}

export interface DeepLinkContextType {
    deepLinkData: DeepLinkParams | null;
    handleDeepLink: (data: DeepLinkParams) => void;
} 