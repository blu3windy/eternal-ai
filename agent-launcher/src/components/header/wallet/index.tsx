import s from './styles.module.scss';
import {Flex, Text, Image} from "@chakra-ui/react";
import cs from 'clsx';
import {ReactElement, useMemo, useRef, useState} from 'react';
import useOnClickOutside from "../../../hooks/useOnClickOutSide.ts";

type DropdownMenuType = {
  items: React.ReactNode[];
  onClose: () => void;
  color?: 'white' | 'black';
};

const DropDownMenu = ({
  items,
  onClose,
  color,
}: DropdownMenuType): ReactElement => {
  const targetRef = useRef<HTMLUListElement>(null);
  useOnClickOutside(targetRef, () => {
    onClose();
  });

  //TODO: hardcode
  const isConnectedAccessToken = false;

  return (
    <ul
      ref={targetRef}
      className={cs(s.dropMenu_list, {
        [s.dropMenu_list__dark]: color === 'white',
      })}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      onMouseLeave={onClose}
    >
      {items.map((item: React.ReactNode, index) => (
        <li
          key={`menu_${index}_${isConnectedAccessToken}`}
          className={s.listItem}
        >
          {item}
        </li>
      ))}
    </ul>
  );
};

interface IProps {
  color?: 'white' | 'black';
  isTrading?: boolean;
}

const HeaderWallet: React.FC<IProps> = ({
  color = 'white',
}) => {
  const [isShowMenu, setIsShowMenu] = useState(false);

  const handleMenuMouseEnter = () => {
    setIsShowMenu(true);
  }

  const onClickWalletBalance = () => {
  };

  const menuItems = useMemo(() => {
    const items: any[] = [];

    return items;
  }, [])

  const renderUserInfor = () => {
    return (
      <Flex
        className={s.userInfo__desktop}
        flexDir={'row'}
        align={'center'}
        _hover={{
          cursor: 'pointer',
        }}
        onMouseEnter={handleMenuMouseEnter}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div
          className={cs(s.wallets, 'wallet')}
          onClick={(e) => {
            e.stopPropagation();
            onClickWalletBalance();
          }}
        >
          <Flex
            className={cs(s.wallets__item, 'item')}
            style={{
              border:
                color === 'black'
                  ? '1px solid #e5e7eb'
                  : '1px solid #ffffff12',
              background:
                color === 'black' ? '#f8f9fa' : 'rgba(255, 255, 255, 0.1)',
            }}
          >
            <Image
              src={
                color === 'black'
                  ? `/icons/ic-wallet-black.svg`
                  : `/icons/ic-wallet.svg`
              }
            />

            <Text
              textAlign={'center'}
              fontSize={'14px'}
              lineHeight={'20px'}
              fontWeight={400}
              color={color}
              whiteSpace={'nowrap'}
            >
              {`0.00 EAI`}
            </Text>
          </Flex>
        </div>

        <div className={cs(s.menusAction, 'dropdown')}>
          {/* <Image
              src={
                isYellow
                  ? `/icons/chevron-down-yellow.svg`
                  : `/icons/chevron-down.svg`
              }
            /> */}

          {isShowMenu && !!menuItems.length && (
            <DropDownMenu
              items={menuItems}
              color={color}
              onClose={() => {
                setIsShowMenu(false);
              }}
            />
          )}
        </div>
      </Flex>
    );
  }

  return <div className={s.wrapper}>{renderUserInfor()}</div>;
};

export default HeaderWallet;
