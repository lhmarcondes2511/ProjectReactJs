import styles from './css/select.module.css'

function Select({ text, name, options, handleOncChange, value }){
    return(
        <div className={styles.form_control}>
            <label htmlFor={name}>{text}</label>
            <select name={name} id={name} onChange={handleOncChange} value={value || ''}>
                <option>Selecione uma opção</option>
                {options.map((option) => (
                    <option value={option.id} key={option.id}>{option.name}</option>
                ))}
            </select>
        </div>
    )
}

export default Select