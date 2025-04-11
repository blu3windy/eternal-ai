import SearchingIcon from './icons/Searching';
import s from './styles.module.scss';

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from 'remark-breaks'
import { motion } from 'framer-motion';
import { useMemo } from 'react';
import MagicIcon from './icons/Magic';
import ReadingIcon from './icons/Reading';

export type TaskType = {
  id: string;
  type: "toolcall" | "searching" | "listing" | "getting" | string;
  typeLabel?: string;
  content: string;
  result: string;
}

const TYPE_LABELS = {
  toolcall: "Tool Call",
  searching: "Searching",
  listing: "Listing",
  getting: "Getting",
}

function Task({
  data,
}: {
  data: TaskType | string;
}) {

  const IconPicking = useMemo(() => {
    if (typeof data === 'string') {
      return null;
    }
    switch (data.type) {
      case "searching":
        return <SearchingIcon />;
      case "searching":
        return <ReadingIcon />;
      case "getting":
        return "⏳";
    }

    return <MagicIcon />
  }, [(data as TaskType)?.type]);

  if (typeof data === 'string') {
    return <div className={s.task}>
      <Markdown
        remarkPlugins={[remarkGfm, remarkBreaks]}
        children={data as string}
      />
    </div>
  }

  return (
    <div className={s.task}>
      <div className={s.process}>
        <div className={s.type}>{data.typeLabel || TYPE_LABELS[data.type] || data.type}</div>
        <div className={s.content}>
          {!!data.result ? (
            <span>{IconPicking}</span>
          ) : (
            <motion.span 
              className={s.content_icon}
              animate={{ 
                scale: [0.9, 1.1, 0.9],
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              {IconPicking}
            </motion.span>
          )}
          <span className={s.content_text}>
            {data.content}
          </span>
        </div>
      </div>
      <div className={s.result}>
        {!!data.result ? (
          <Markdown
            remarkPlugins={[remarkGfm, remarkBreaks]}
            children={data.result as string}
          />
        ) : (
          <Skeleton
            width={100}
            height={20}
          />
        )}
      </div>
    </div>
  );
}

export default Task;