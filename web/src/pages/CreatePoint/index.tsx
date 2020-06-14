import React, { useEffect, useState, ChangeEvent } from 'react'
import './styles.css'
import { Link } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'
import { Map, TileLayer, Marker } from 'react-leaflet'
import axios from 'axios'
import { LeafletMouseEvent } from 'leaflet'
import api from '../../services/api'

import logo from '../../assets/logo.svg'

interface Item {
    id: number;
    title: string;
    image_url: string;
}

interface IBGEUFResponse {
    sigla: string
}

interface IBGECityResponse {
    nome: string
}


const CreatePoint = () => {

    // sempre que cria um estado para um array ou objeto precisamos informar manualmente o tipo do objeto
    const [items, setItems] = useState<Item[]>([])
    const [ufs, setUFs] = useState<string[]>([])
    const [cities, setCities] = useState<string[]>([])

    const [initialPosition, setInicPosition] = useState<[number, number]>([0, 0])

    const [selectedUF, setSelectedUF] = useState('0')
    const [selectedCity, setSelectedCity] = useState('0')
    const [selectedPosition, setSelectedPosition] = useState<[number, number]>([0, 0])

    useEffect( () => {
        navigator.geolocation.getCurrentPosition(position => {
            const {latitude, longitude} = position.coords
            setInicPosition([latitude, longitude])
        })
    }, [])

    useEffect( () => {
        api.get('items').then(res => {
            setItems(res.data)
        })
    }, [])

    // define o formato da responsta para a interface que criamos
    useEffect( () => {
        axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(res => {
            const ufInitials = res.data.map(uf => uf.sigla)
            setUFs(ufInitials)
        })
    }, [])

    useEffect( () => {
        axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUF}/municipios`)
             .then( res => {
                 const cityName = res.data.map(city => city.nome)
                 setCities(cityName)
             })
    }, [selectedUF])

    function handleSelectUF(event: ChangeEvent<HTMLSelectElement>){
        const uf = event.target.value
        setSelectedUF(uf)
    }

    function handleSelecetCity(event: ChangeEvent<HTMLSelectElement>){
        const city = event.target.value
        setSelectedCity(city)
    }

    function handleMapClick(event: LeafletMouseEvent){
        setSelectedPosition([
            event.latlng.lat,
            event.latlng.lng
        ])
    }

    return (
        <div id="page-create-point">
            <header>
                <img src={logo} alt="Ecoleta"/>
                <Link to="/">
                    <FiArrowLeft />
                    Voltar para home
                </Link>
            </header>

            <form>
                <h1>Cadastro do <br/> ponto de coleta</h1>
                <fieldset>
                    <legend>
                        <h2>Dados</h2>    
                    </legend>
                    <div className="field">
                        <label htmlFor="name">Nome da Entidade</label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                        />
                    </div>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="email">E-mail</label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="whatsapp">WhatsApp</label>
                            <input
                                type="text"
                                name="whatsapp"
                                id="whatsapp"
                            />
                        </div>
                    </div>    
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Endereço</h2>
                        <span>Selecione o endereço no mapa</span>   
                    </legend>

                    <Map center={initialPosition} zoom={15} onClick={handleMapClick}>
                        <TileLayer 
                            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={selectedPosition}/>
                    </Map>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="uf">Estado (UF)</label>
                            <select name="uf" id="uf" value={selectedUF} onChange={handleSelectUF}>
                                <option value="0">Selecione uma UF</option>
                                {ufs.map( uf => (
                                    <option key={uf} value={uf}>{uf}</option>
                                ))}
                            </select>
                        </div>
                        <div className="field">
                            <label htmlFor="city">Cidade</label>
                            <select name="city" id="city" value={selectedCity} onChange={handleSelecetCity}>
                                <option value="0">Selecione uma cidade</option>
                                {cities.map( city => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>
                        </div>
                    </div>    
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Itens de Coleta</h2>
                        <span>Selecione um ou mais itens abaixo</span>
                    </legend>
                    <ul className="items-grid">
                        {items.map(item => (
                            <li key={item.id}>
                                <img src={item.image_url} alt="oil"></img>
                                <span>{item.title}</span>
                            </li>
                        ))}

                    </ul>
                </fieldset>

                <button type="submit">Cadastrar um ponto de coleta</button>

            </form>
        </div>
    )
}

export default CreatePoint