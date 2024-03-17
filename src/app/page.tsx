import styles from "./page.module.css";
import PolinomioTaylor from "@/app/Taylor";
import { ToastContainer } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.description}>
          <PolinomioTaylor/>
          <ToastContainer />
      </div>
    </main>
  );
}
