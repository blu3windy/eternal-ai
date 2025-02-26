import type { EarningsNode } from '../../../../types/data';
import { useNodes } from '../../stores/useNodes';
import CardBase from '../card-base';
import styles from './styles.module.scss';
type Props = EarningsNode

const UNSELECTED_STYLE = {
  borderColor: '#EFEFEF',
  backgroundColor: '#FAFAFA',
}

const SELECTED_STYLE = {
  borderColor: 'linear-gradient(to right, #00F5A0 0%, #00D9F5 100%)',
  backgroundColor: '#fff',
  borderWidth: '2px',
}

const NodeCard = ({ id, name, image, earnings, status }: Props) => {
  const { selectedItem, setSelectedItem } = useNodes();

  return (
    <CardBase className={styles.card} onClick={() => setSelectedItem(selectedItem )} {...(selectedItem?.id === id ? SELECTED_STYLE : UNSELECTED_STYLE)}>
      <h5 className={styles.card_name}>{name}</h5>

      <div className={styles.card_imageWrapper} style={{ background: `url(${image}) 50% / cover no-repeat` }}>
      </div>

      <h4 className={styles.card_earnings}>{earnings} EAI</h4>

      <p className={styles.card_status}>{status}</p>
    </CardBase>
  )
}

export default NodeCard
