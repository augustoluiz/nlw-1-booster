import React from 'react'

//React.FC => Function compenent, um componente escrito em forma de funcao

//propriedade obrigatória, sem ponto de interrogação ex: title: string
//propriedade não obrigatória, coloca o ponto de interrogação ex: title?: string

interface HeaderProps {
    title: string;
}

//O props é a propriedade, mas não necessáriamente precisa ter o nome de props
//Estado => armazenar uma informação a partir do componente

const Header: React.FC<HeaderProps> = (props) => {
    return(
        <header>
            <h1>{props.title}</h1>
        </header>
    )
}

export default Header