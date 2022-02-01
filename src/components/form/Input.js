import styles from './css/input.module.css'

function Input({ type, text, name, placeholder, handleOncChange, value }){
    return(
        <div className={styles.form_control}>
            <label htmlFor={name}>{text}</label>
            <input type={type} name={name} id={name} placeholder={placeholder} onChange={handleOncChange} value={value} />
        </div>
    )
}

export default Input