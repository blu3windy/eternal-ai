import Dexie, { type EntityTable } from 'dexie';
import { IChatMessage } from '../services/api/agent/types.ts';

export type PersistedMessageType = {
   threadId: string;
   // status: 'sending' | 'done' | 'thinking' | 'error';
} & IChatMessage;

class ChatAgentDatabase {
   private databaseName = 'chat-agent-database';
   private db;
   constructor() {
      try {
         this.db = new Dexie(this.databaseName) as Dexie & {
            messages: EntityTable<PersistedMessageType, 'id'>;
         };

         // for version 1
         this.db.version(1).stores({
            messages: 'id, threadId, is_reply, msg, name, createdAt',
         });

         // // https://dexie.org/docs/Version/Version.upgrade()
         // // for version n
         // this.db
         //     .version(n)
         //     .stores({
         //         // add new stores
         //     })
         //     .upgrade((trans) => {
         //         var YEAR = 365 * 24 * 60 * 60 * 1000;
         //         return trans
         //             .table('friends')
         //             .toCollection()
         //             .modify((friend) => {
         //                 friend.birthdate = new Date(Date.now() - friend.age * YEAR);
         //                 delete friend.age;
         //             });
         //     });
      } catch (e) {
         //
      }
   }

   async loadChatItems(
      threadId: string,
      pagination?: { offset: number; limit: number }
   ): Promise<IChatMessage[]> {
      try {
         // this.db.messages.where('age').above(25).reverse().sortBy('name');

         // if (pagination) {
         //   return await this.db?.messages
         //     .where('threadId')
         //     .equals(threadId)
         //     .sortBy('createdAt')
         //     .offset(pagination.offset)
         //     .limit(pagination.limit)
         //     .toArray();
         // }
         return await this.db?.messages.where('threadId').equals(threadId).sortBy('createdAt');
      } catch (error) {
         return [];
      }
   }

   async addChatItem(newItem: PersistedMessageType) {
      try {
         await this.db?.messages.add({
            ...newItem,
         });
         return newItem;
      } catch (e) {
         //
      }
   }

   async updateChatItem(updatedItem: PersistedMessageType) {
      try {
         await this.db?.messages.update(updatedItem.id, updatedItem);
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
}

const chatAgentDatabase = new ChatAgentDatabase();
export default chatAgentDatabase;
