import Dexie, { type EntityTable } from "dexie";
import { IChatMessage } from "../services/api/agent/types.ts";
import orderBy from "lodash/orderBy";
import { v4 } from "uuid";

export type ChatSession = {
    id: string;
    name: string;
    createdAt: number;
    updatedAt: number;
    lastMessage?: string;
    threadId: string;
};

export type PersistedMessageType = {
   threadId: string;
   uuid: string;
} & IChatMessage;

class ChatAgentDatabase {
   private databaseName = "chat-agent-database";
   private db;
   
   constructor() {
      try {
         this.db = new Dexie(this.databaseName) as Dexie & {
            messages: EntityTable<PersistedMessageType, "id">;
            sessions: EntityTable<ChatSession, "id">;
         };

         // Upgrade to version 2 to add sessions
         this.db.version(2).stores({
            messages: "id, threadId, uuid, is_reply, msg, name, createdAt",
            sessions: "id, threadId, createdAt, updatedAt"
         });
      } catch (e) {
         //
      }
   }

   // Add new methods for session management
   async createSession(threadId: string): Promise<string> {
       const sessionId = v4();
       await this.db?.sessions.add({
           id: sessionId,
           threadId: threadId,
           name: "New Chat",
           createdAt: Date.now(),
           updatedAt: Date.now(),
       });
       return sessionId;
   }

   async updateSessionName(sessionId: string, name: string) {
       await this.db?.sessions.update(sessionId, {
           name,
           updatedAt: Date.now()
       });
   }

   async updateSessionLastMessage(sessionId: string, lastMessage: string) {
       await this.db?.sessions.update(sessionId, {
           lastMessage,
           updatedAt: Date.now()
       });
   }

   async getSessions(threadId: string): Promise<ChatSession[]> {
       return await this.db?.sessions
           .where('threadId')
           .equals(threadId)
           .reverse()
           .sortBy('updatedAt');
   }

   async deleteSession(sessionId: string) {
       await this.db?.sessions.delete(sessionId);
       await this.clearChatItems(sessionId);
   }

   async loadChatItems(sessionId: string, pagination?: { offset: number; limit: number }): Promise<IChatMessage[]> {
      try {
         const messages = await this.db?.messages.where("uuid").equals(sessionId).sortBy("createdAt");

         const migrateMessages = messages.filter((item) => typeof item.createdAt === "string");
         setTimeout(() => {
            try {
               if (migrateMessages.length > 0) {
                  migrateMessages.forEach((item) => {
                     this.db?.messages.update(item.id, {
                        createdAt: new Date(item.createdAt).getTime(),
                     });
                  });
               }
            } catch (e) {
               //
            }
         }, 0);

         const normalizedMessages = messages?.map((item) => ({
            ...item,
            createdAt: new Date(item.createdAt).getTime(),
         }));

         return orderBy(normalizedMessages, "createdAt", "asc");
      } catch (error) {
         return [];
      }
   }

   async addChatItem(newItem: PersistedMessageType) {
      try {
         await this.db?.messages.add({
            ...newItem,
            createdAt: new Date().getTime()
         });
         return newItem;
      } catch (e) {
         //
      }
   }

   async updateChatItem(updatedItem: PersistedMessageType) {
      try {
         const normalizedItem = {
            ...updatedItem
         }

         delete normalizedItem.createdAt;
         await this.db?.messages.update(updatedItem.id, {
            ...normalizedItem,
            updatedAt: new Date().getTime()
         });
         return updatedItem;
      } catch (e) {
         //
      }
   }

   async deleteChatItem(id: string) {
      try {
         await this.db?.messages.delete(id);
      } catch (e) {
         //
      }
   }

   async getMessageItemById(id: string) {
      try {
         return await this.db?.messages.get(id);
      } catch (e) {
         //
      }
   }

   async clearChatItems(sessionId: string) {
      try {
         await this.db?.messages.where("uuid").equals(sessionId).delete();
      } catch (e) {
         console.log('_________clearChatItems', e);
      }
   }

   // TODO: create new threadID with structure
   // threadId: [{
   //    uuid: string;
   //    createdAt: number;
   //    updatedAt: number;
   //    messages: IChatMessage[];
   // }]  
   async createNewThreadId(threadId: string) {
      try {
         await this.db?.threads.add({
            threadId: threadId,
            uuid: v4(),
            createdAt: new Date().getTime(),
            updatedAt: new Date().getTime(),
         });
      } catch (e) {
         //
      }
   }

   // TODO: get all threadID buy threadId with structure
   // threadId: [{
   //    uuid: string;
   //    createdAt: number;
   //    updatedAt: number;
   //    messages: IChatMessage[];
   // }] 
   async getAllThreadId(threadId: string) {
      try {
         return await this.db?.threads.where("threadId").equals(threadId).toArray();
      } catch (e) {
         //
      }
   }

   // TODO: migrate messages with threadId, if message not exist uuid, then update uuid from threadId
   // threadId: [{
   //    uuid: string;
   //    createdAt: number;
   //    updatedAt: number;
   //    messages: IChatMessage[];
   // }]  
   async migrateMessages(threadId: string) { 
      try {
         const threadItems = await this.getSessions(threadId);

         if (threadItems?.length > 0) {
            const messages = await this.loadChatItems(threadId);

            if (messages?.length > 0) {
               messages.forEach((message, i) => {
                  if (i === 1) {
                     const match = message.msg.match(/<\/think>\s*([\s\S]*)/);
                     const result = match ? match[1].trim() : '';
                     this.updateSessionName(threadItems[0].id, result || "New Chat");
                  }
                  this.updateChatItem({ ...message, threadId: threadId, uuid: threadItems[0].id });
               });
            }
         }
      } catch (e) {
         //
      }
   }

}

const chatAgentDatabase = new ChatAgentDatabase();
export default chatAgentDatabase;
