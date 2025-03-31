import React from "react";
import { IMonitorContext } from "./interface";

const initialValue: IMonitorContext = {
   containers: [],
   totalMemory: { used: '0MB', total: '0GB' },
   totalCPU: { used: '0%', total: '800%' },
};

export const MonitorContext = React.createContext<IMonitorContext>(initialValue);
