import { React, useState } from 'react'
import { makeStyles } from '@material-ui/styles'
import Button from '@material-ui/core/Button'

const useStyles = makeStyles({
    surpresa: {
        display: 'block',
        margin: '0 auto',
        transition: 'opacity 1s linear'
    },
    button: {
        textAlign: 'center'
    }
})


export default function HomePage() {
    const classes = useStyles()

    const [visible, setVisible] = useState(false)

    function handleSurpresa() {
        if(visible === false) setVisible(true)
        else setVisible(false)
    }

    return (
        <>


            <p className={classes.button}>
                <Button variant="contained" color="secondary" onClick={handleSurpresa}>
                    SUPRESA!
                </Button>
            </p>

            <div
                style={{opacity: visible ? '1' : '0'}}
                className={classes.surpresa}
            >
                <h1>Criação de formulário com React.js</h1>
                <p>Projeto construído na disciplina de Programação Web da FATEC Franca.</p>
            </div>
        </>
    )
}