import styles from './styles.module.scss';
import React from 'react';
import cs from 'clsx';
import Loading from "../Loading";

interface IProps {
  className?: string | undefined;
}

const AppLoading = React.memo((props: IProps) => {
  return (
    <div className={cs(styles.container, props.className)}>
      <Loading />
    </div>
  );
});

AppLoading.displayName = 'AppLoading';

export default AppLoading;
