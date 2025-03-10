/* eslint-disable react-hooks/rules-of-hooks */
import { createStandaloneToast } from "@chakra-ui/react";
import ToastMessage from "./ToastMessage";

const { toast } = createStandaloneToast();

export interface ToastMessageIProps {
  id?: any;
  message: string;
  url?: string;
  linkText?: string;
  description?: string;
  status?: "success" | "error";
}

export const showMessage = (props: ToastMessageIProps) => {
  toast({
    position: "bottom-right",
    render: (v) => <ToastMessage {...props} id={v.id as string} />,
  });
};

export const removeToast = () => {
  toast.closeAll();
};
