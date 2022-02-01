import styles from '../project/css/projectform.module.css'
import { useState } from 'react'
import Input from '../form/Input'
import SubmitButton from '../form/Submit'


function ServiceForm({ handleSubmit, btnText, projectData }){

    const [service, setService] = useState({})

    function submit(e){
        e.preventDefault()
        projectData.services.push(service)
        console.log(service)
        handleSubmit(projectData)
    }

    const handleChange = (e) => {
        setService({ ...service, [e.target.name]: e.target.value })
    }

    return (
        <form onSubmit={submit} className={styles.form}>
            <Input 
                type="text" 
                text="Nome do serviço"
                name="name"
                placeholder="Insira o nome do serviço"
                handleOncChange={handleChange} 
            />
            <Input 
                type="number" 
                text="Custo do serviço"
                name="cost"
                placeholder="Insira o valor total do serviço"
                handleOncChange={handleChange} 
            />
            <Input 
                type="text" 
                text="Descrição do serviço"
                name="description"
                placeholder="Descreva o serviço"
                handleOncChange={handleChange} 
            />
            <SubmitButton text={btnText} />
        </form>
    )
}

export default ServiceForm