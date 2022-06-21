import React from 'react'
import { Container, Row } from 'react-bootstrap'
import "./Template.css"

const Template = ({ title, children }) => {
    return (
        <div className='templateback'>
            <Container className='app-container-template'>
                <Row>
                    <div className='pageTemplate'>
                        {title && (
                            <>
                                <h3 className='headingTemplate'> {title}</h3>
                                <hr />
                            </>
                        )}
                        {children}
                    </div>
                </Row>
            </Container>
        </div>
    )
}

export default Template
