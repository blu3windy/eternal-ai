import cn from 'classnames'
import React, { type ButtonHTMLAttributes } from 'react'
import styles from './styles.module.scss'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon?: React.ReactNode;
  losePaddingLeft?: boolean;
  losePaddingRight?: boolean;
  primary?: boolean;
}

const ButtonBase = ({ icon, losePaddingLeft = false, losePaddingRight = false, primary = false, className, ...props }: Props) => {
  return (
    <button className={cn(styles.button, className, {
      [styles.button__losePaddingLeft]: losePaddingLeft,
      [styles.button__losePaddingRight]: losePaddingRight,
      [styles.button__primary]: primary,
    })} {...props}>
      {icon && <span className={styles.button_icon}>{icon}</span>}

      <span className={styles.button_text}>
        {props.children}
      </span>
    </button>
  )
}

export default ButtonBase
