import Input from '../form/Input'
import styles from './css/projectform.module.css'
import Select from '../form/Select'
import Submit from '../form/Submit'
import { useState, useEffect } from 'react'

function ProjectForm({ handleSubmit, btnText, projectData }) {

    const [categories, setCategories] = useState([])
    const [project, setProject] = useState(projectData || [])

    useEffect(() => {
        fetch("http://localhost:5000/categories", {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then((resp) => resp.json())
        .then((data) => {
            setCategories(data)
        })
        .catch(err => console.log(err))
    }, [])

    const submit = (e) => {
        e.preventDefault()
        handleSubmit(project)
    }

    // Método dinamico para alterar o valor de qualquer input
    function handleChange(e){
        setProject({ ...project, [e.target.name]: e.target.value })
    }

    function handleCategory(e){
        setProject({ 
            ...project, 
            category: {
                id: e.target.value,
                name: e.target.options[e.target.selectedIndex].text
            }
        })
    }


    return (
        <form onSubmit={submit} className={styles.form}>
            <Input 
                type='text' 
                name='name' 
                text='Nome do Projeto' 
                value={project.name ? project.name : ''} 
                handleOncChange={handleChange} 
                placeholder='Insira o nome do projeto' 
            />
            <Input 
                type='number' 
                name='budget' 
                text='Orçamento do Projeto' 
                value={project.budget ? project.budget : ''} 
                handleOncChange={handleChange} 
                placeholder='Insira o orçamento total' 
            />
            <Select 
                name='category_id' 
                text='Selecione a categoria' 
                handleOncChange={handleCategory} 
                value={project.category ? project.category.id : ''} 
                options={categories} 
            />
            <Submit text={btnText} />
        </form>
    )
}

export default ProjectForm