import styles from './Containers.modules.css';

function Containers(props) {
  return <div className={styles.container}>{props.children()}</div>;
}

export default Containers;
