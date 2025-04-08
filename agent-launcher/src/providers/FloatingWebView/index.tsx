
import Draggable from 'react-draggable'; 
import { floatingWebViewSelector } from "@stores/states/floating-web-view/selector";
import { useDispatch, useSelector } from "react-redux";
import styles from "./styles.module.scss";
import { useMemo } from "react";
import WebView from "@components/WebView";
import { Button, Text, Flex, Box } from "@chakra-ui/react";
import SvgInset from "@components/SvgInset";
import { reset, toggleMaximize } from "@stores/states/floating-web-view/reducer";


const MARGIN = 48;

const POSITION = {
  'top-left': {
    top: 0 + MARGIN,
    left: 0 + MARGIN,
  },
  'top-right': {
    top: 0 + MARGIN,
    right: 0 + MARGIN,
  },
  'bottom-left': {
    bottom: 100 + MARGIN,
    left: 0 + MARGIN,
  },
  'bottom-right': {
    bottom: 100 + MARGIN,
    right: 0 + MARGIN,
  },
  'center': {
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
}


function FloatingWebView() {
  const dispatch = useDispatch();
  const { isOpen, url, isMaximized, viewPosition, task, taskProcessing } = useSelector(floatingWebViewSelector);

  const positionStyles = useMemo(() => {
    if (isMaximized) {
      return {
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
      }
    }
    return POSITION[viewPosition];
  }, [viewPosition, isMaximized]);

  const sizeStyles = useMemo(() => {
    return {
      width: isMaximized ? '100%' : '650px',
      height: isMaximized ? '100%' : '450px',
    }
  }, [isMaximized]);

  if (isOpen && url) {
    return (
      // <Draggable>
        <div 
          className={styles.floatingWebView}
          style={{
            ...positionStyles,
            ...sizeStyles
          }}
        >
          <Flex
            flexDirection="column"
            width="100%"
            height="100%"
            gap={
              isMaximized ? 0  : "12px"
            }
          >
            <div className={styles.header}>
              <Text
                fontSize={"14px"}
                color="black"
                fontWeight={"600"}
                lineHeight={"20px"}
              >Liveview</Text>
              <Flex gap="12px" alignItems="center">
                {isMaximized ? (
                  <SvgInset 
                    className={styles.icon} 
                    size={20} 
                    svgUrl={'/icons/ic-minimize.svg'} 
                    onClick={() => dispatch(toggleMaximize(false))}
                  />
                ) : (
                  <SvgInset 
                    className={styles.icon} 
                    size={20} 
                    svgUrl={'/icons/ic-maximize.svg'} 
                    onClick={() => dispatch(toggleMaximize(true))}
                  />
                )}
      
                <SvgInset 
                  className={styles.icon} 
                  size={20} 
                  svgUrl={'/icons/ic-close.svg'}
                  onClick={() => dispatch(reset())}
                />
              </Flex>
            </div>
            {!isMaximized && !!task && !!taskProcessing && (
              <Flex paddingLeft={"16px"} paddingRight={"16px"} alignItems={"center"} gap={"8px"}>
                <Box
                  borderRadius={"4px"}
                  border="1px solid #E5E7EB"
                  padding={"12px"}
                  background={"#F8F9FA"}
                >
                  <div
                    className={styles.searchingIcon}
                  >
                    <SvgInset svgUrl="/icons/ic-search.svg" size={16} />
                  </div>
                </Box>
                <Flex
                  flexDirection={"column"}
                  gap={"2px"}
                  overflow={"hidden"}
                >
                  <Text
                    fontSize={"14px"}
                    fontWeight={"500"}
                    lineHeight={"20px"}
                    color="#2E2E2E"
                  >
                    {task}
                  </Text>
                  <Text
                    fontSize={"14px"}
                    fontWeight={"500"}
                    lineHeight={"20px"}
                    color="#2E2E2E"
                    opacity={0.7}
                    textOverflow={"ellipsis"}
                    overflow={"hidden"}
                    whiteSpace={"nowrap"}
                  >
                    {taskProcessing}
                  </Text>
                </Flex>
              </Flex>
            )}
            <div 
              className={styles.content}
              style={{
                paddingLeft: isMaximized ? 0 : "16px",
                paddingRight: isMaximized ? 0 : "16px",
                paddingBottom: isMaximized ? 0 : "16px",
              }}
            >
              <div 
                className={styles.webView}
                style={{
                  borderRadius: isMaximized ? 0 : "8px",
                }}
              >
                <iframe
                  src={url}
                  height="100%"
                  width="100%"
                />
              </div>
            </div>
          </Flex>
        </div>
      // </Draggable>
    )
  }
  return null;
}

export default FloatingWebView;