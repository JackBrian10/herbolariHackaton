import React from 'react'
import { Button, Container, Row } from 'react-bootstrap';
import './HeroPage.css'

const HeroPage = () => {

    return <div className='main'>
        <Container>
            <Row>
                <div className='intro-text'>
                    <div>
                        <h1 className='title'> Benvinguts al teu Herbolari Digital </h1>
                        <p className='subtitle'> On podràs fer un catàleg dels arbres de la UAB i consultar les alèrgies que provoquen</p>
                    </div>
                    <div className='buttonContainer'>
                        <a href='/login'>
                            <Button size='lg' className='herobutton'>
                                Login
                            </Button>
                        </a>
                        <a href='/register'>
                            <Button size='lg' className='herobutton'>
                                Sign Up
                            </Button>
                        </a>
                    </div>
                    
                    
                </div>


            </Row>
        </Container>
    </div>;
};

export default HeroPage;