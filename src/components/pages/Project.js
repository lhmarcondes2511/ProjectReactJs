import { parse, v4 as uuidv4 } from 'uuid'
import styles from './css/project.module.css'
import { useParams} from 'react-router-dom'
import { useEffect, useState } from 'react'
import Loading from '../layout/Loading'
import Container from '../layout/Container'
import ProjectForm from '../project/ProjectForm'
import Message from '../layout/Message'
import ServiceForm from '../service/ServiceForm'
import ServiceCard from '../service/ServiceCard'

function Project(){

    const { id } = useParams()
    const [project, setProject] = useState([])
    const [services, setServices] = useState([])
    const [showProjectForm, setShowProjectForm] = useState(false)
    const [showServiceForm, setShowServiceForm] = useState(false)
    const [message, setMessage] = useState()
    const [type, setType] = useState()

    useEffect(() => {
        setTimeout(() => {
            fetch(`http://localhost:5000/projects/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(resp => resp.json())
            .then((data) => {
                setProject(data)
                setServices(data.services)
            })
            .catch(error => console.log(error))
        }, 300)
    }, [id])

    function editPost(project){
        setMessage('')

        //budget validation
        if(project.budget < project.cost){
            setMessage('O orçamento não pode ser menor que o custo do projeto!')
            setType('error')
            return false
        }

        fetch(`http://localhost:5000/projects/${project.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(project)
        })
        .then(resp => resp.json())
        .then((data) => {
            setProject(data)
            setShowProjectForm(false)
            setMessage('Projeto Atualizado com sucesso!')
            setType('success')
        })
        .catch(error => console.log(error))
    }

    function toggleProjectForm(){
        setShowProjectForm(!showProjectForm)
    }
    
    function toggleServiceForm(){
        setShowServiceForm(!showServiceForm)
    }
    
    function createService(project){
        setMessage('')
        const lastServices = project.services[project.services.length - 1]

        lastServices.id = uuidv4()
        const lastServicesCost = lastServices.cost
        const newCost = parseFloat(project.cost) + parseFloat(lastServicesCost)

        if(newCost > parseFloat(project.budget)){
            setMessage('Orçamento ultrapassado, verifique o valor do serviço')
            setType('error')
            project.services.pop()
            return false
        }

        project.cost = newCost

        fetch(`http://localhost:5000/projects/${project.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(project)
        })
        .then(resp => resp.json())
        .then((data) => {
            setShowServiceForm(false)
        })
        .catch(error => console.log(error))

    }

    function removeService(id, cost){
        setMessage('')
        const servicesUpdate = project.services.filter((service) => service.id !== id)

        const projectUpdated = project

        projectUpdated.services = servicesUpdate
        projectUpdated.cost = parseFloat(projectUpdated.cost) - parseFloat(cost)

        fetch(`http://localhost:5000/projects/${projectUpdated.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(projectUpdated)
        })
        .then(resp => resp.json())
        .then((data) => {
            setProject(projectUpdated)
            setServices(servicesUpdate)
            setMessage('Serviço removido com sucesso!')
            setType('success')
        })
        .catch(error => console.log(error))
    }

    return (
        <>
        {project.name ? (
            <div className={styles.project_details}>
                <Container customClass="column">
                    {message && <Message msg={message} type={type} /> }
                    <div className={styles.details_container}>
                        <h1>Projeto: {project.name}</h1>
                        <button className={styles.btn} onClick={toggleProjectForm}>
                            {!showProjectForm ? 'Editar Projeto' : 'Fechar' }
                        </button>
                        {!showProjectForm ? (
                            <div className={styles.project_info}>
                                <p>
                                    <span>Categoria: </span> {project.category.name}
                                </p>
                                <p>
                                    <span>Total do orçamento: </span> R$ {project.budget}
                                </p>
                                <p>
                                    <span>Total utilizado: </span> R$ {project.cost}
                                </p>
                            </div>
                        ) : (
                            <div className={styles.project_info}>
                                <ProjectForm handleSubmit={editPost} btnText='Concluir edição' projectData={project} />
                            </div>
                        )}
                    </div>
                    <div className={styles.service_form_container}>
                        <h2>Adicione um serviço: </h2>
                        <button className={styles.btn} onClick={toggleServiceForm}>
                            {!showServiceForm ? 'Adicionar Serviço' : 'Fechar' }
                        </button>
                        <div className={styles.project_info}>
                            {showServiceForm && (
                                <ServiceForm handleSubmit={createService} btnText='Adicionar Serviço' projectData={project} />
                            )}
                        </div>
                    </div>
                    <h2>Serviços</h2>
                    <Container customClass="start">
                        {services.length > 0 ? (
                            services.map((service) => (
                                <ServiceCard 
                                    id={service.id}
                                    name={service.name}
                                    cost={service.cost}
                                    description={service.description}
                                    key={service.key}
                                    handleRemove={removeService}
                                />
                            ))
                        ): (
                            <p>Não há serviços cadastrados.</p>
                        )}
                    </Container>
                </Container>
            </div>
        ) : (
            <Loading />
        )}
        </>
    )
}

export default Project