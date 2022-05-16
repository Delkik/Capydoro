import * as React from 'react';
import { FiHome, FiUsers, FiHeadphones, FiClock } from 'react-icons/fi';
import { MdAdd } from 'react-icons/md';
import { Link } from 'react-router-dom';
import { TaskModalContext } from '../../App';
import styles from './navbar.module.css';

const Navbar = () => {

    const { setViewTaskModal, setTaskModalProps } = React.useContext(TaskModalContext!);

    const createNewTask = () => {
        setViewTaskModal!(true);
        setTaskModalProps!({});
    }
    return (
        <div className={styles.navContainer}>
            <button> <Link to='/'><FiHome size={25} color="#495156" /></Link> </button>
            <button> <Link to='/friends'><FiUsers size={25} color="#495156" /></Link> </button>
            <button className={styles.navNewTaskButton} onClick={createNewTask}> <MdAdd size={35} color="#151718" />  </button>
            <button> <Link to='/timer'><FiClock size={25} color="#495156" /></Link> </button>
            <button> <FiHeadphones size={25} color="#495156" /> </button>
        </div >
    );
}

export default Navbar;