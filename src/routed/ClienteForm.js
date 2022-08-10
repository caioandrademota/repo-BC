import { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory, useParams } from "react-router-dom";
import TextField from "@material-ui/core/TextField";
import { TextareaAutosize } from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";
import ConfirmDialog from "../ui/ConfirmDialog";
import Snackbar from "@material-ui/core/Snackbar";
import MenuItem from "@material-ui/core/MenuItem";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import InputMask from "react-input-mask";
import axios from "axios";
// variáveis de estilo
const useStyles = makeStyles((theme) => ({
  h1: {
    marginBottom: "24px",
  },
  h2: {
    marginBottom: "42px",
  },
  form: {
    maxWidth: "80%",
    margin: "0 auto",
    display: "flex",
    justifyContent: "space-between",
    flexWrap: "wrap",
    "& .MuiFormControl-root": {
      minWidth: "200px",
      maxWidth: "500px",
      marginBottom: "24px",
    },
    "& Button": {
      height: "42px",
      width: "120px",
      marginLeft: "120px",
    },
  },
  toolbar: {
    display: "flex",
    flexDirection: "start",
    paddingRight: 0,
    margin: theme.spacing(2, 0),
  },
}));

// formatação de campos com máscara
const formatChars = {
  A: "[A-Za-z]",
  0: "[0-9]",
  "#": "[0-9A-Ja-j]",
};
const cpfMask = "000.000.000-00";
const telMask = "(00) 00000-0000";
const dateMask = "00/00/0000";

export default function ClienteForm() {
  const classes = useStyles();

  // hooks de estado
  const [cliente, setCliente] = useState({
    id: null,
    logradouro: "",
    num_imovel: "",
    complemento: "",
    bairro: "",
    municipio: "",
    uf: "",
    nomeDoEvento: "",
    assuntoDoEvento: "",
    dataDoEvento: "",
    descricaoDoEvento: "",
    realizadorDoEvento: "",
    realizadorDescricao: "",
    realizadorEmail: "",
  });

  const [snackState, setSnackState] = useState({
    open: false,
    severity: "success",
    message: "Registro salvo com sucesso",
  });

  const [btnSendState, setBtnSendState] = useState({
    disabled: false,
    label: "Enviar",
  });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [isModified, setIsModified] = useState(false);

  const history = useHistory();
  const params = useParams();

  useEffect(() => {
    if (params.id) {
      getData(params.id);
    }
  }, []);

  // método get com axios
  async function getData(id) {
    try {
      let response = await axios.get(
        `https://api.faustocintra.com.br/clientes/${id}`
      );
      setCliente(response.data);
    } catch (error) {
      setSnackState({
        open: true,
        severity: "error",
        message: "Não foi possível carregar os dados para edição.",
      });
    }
  }

  // método post com axios
  async function saveData() {
    try {
      setBtnSendState({ disabled: true, label: "Enviando..." });

      var payload = JSON.stringify(cliente);

      if (params.id)
        await axios.put(
          `http://127.0.0.1:8000/mine_block/${params.id}`,
          payload
        );
      else
        await axios.post(`http://127.0.0.1:8000/mine_block/?data=${payload}`);
      console.log(cliente);
      console.log(payload);

      setSnackState({
        open: true,
        severity: "success",
        message: "Registro salvo com sucesso!",
      });
    } catch (error) {
      setSnackState({
        open: true,
        severity: "error",
        message: "ERRO: " + error.message,
      });
    }
    setBtnSendState({ disabled: false, label: "Enviar" });
  }

  // manipulação de eventos nos inputs
  function handleInputChange(event, property) {
    if (event.target.id) property = event.target.id;

    if (property === "rg" || property === "num_imovel") {
      setCliente({
        ...cliente,
        [property]: event.target.value
          .toUpperCase()
          // nao aceita o primeiro caractere como espaço
          .replace(/^\s+/, ""),
      });
    } else if (property === "nomeDoEvento" || property === "municipio") {
      setCliente({
        ...cliente,
        [property]: event.target.value
          .toLowerCase()
          // nao aceita caracteres especiais e nem números
          .replace(/["'~`!@#$%^&()_={}[\]:;,.<>+/?-]+|\d+|^\s+$/g, "")
          // primeira letra de cada palavra maiúscula
          .replace(/(?:^|\s)\S/g, (value) => {
            return value.toUpperCase();
          }),
      });
    } else if (property === "logradouro" || property === "bairro") {
      setCliente({
        ...cliente,
        [property]: event.target.value
          .toLowerCase()
          // nao aceita caracteres especiais, porem aceita números
          .replace(/["'~`!@#$%^&()_={}[\]:;,.<>+/?-]+|^\s+$/g, "")
          // primeira letra de cada palavra maiúscula
          .replace(/(?:^|\s)\S/g, (value) => {
            return value.toUpperCase();
          }),
      });
    } else if (property === "complemento") {
      setCliente({
        ...cliente,
        [property]: event.target.value
          // nao aceita caracteres especiais, porem aceita números
          .replace(/["'~`!@#$%^&()_={}[\]:;,.<>+/?-]+|^\s+$/g, "")
          // primeira letra da primeira palavra maiúscula
          .replace(/^\w/, (value) => {
            // .replace(/(?:^|\s)\S/g, (value) => {
            return value.toUpperCase();
          }),
      });
    } else {
      setCliente({ ...cliente, [property]: event.target.value });
    }
    setIsModified(true);
  }

  function handleSubmit(event) {
    event.preventDefault();
    saveData();
  }

  function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

  // manipulação de eventos da snackbar
  function handleSnackClose(event, reason) {
    if (reason === "clickaway") return;
    setSnackState({ ...snackState, open: false });

    history.push("/formulario-react/list");
  }

  function handleDialogClose(result) {
    setDialogOpen(false);

    if (result) history.push("/formulario-react/list");
  }

  // manipulação de eventos do botão voltar
  function handleGoBack() {
    if (isModified) setDialogOpen(true);
    else history.push("/formulario-react/list");
  }

  return (
    <>
      <ConfirmDialog isOpen={dialogOpen} onClose={handleDialogClose}>
        Há dados não salvos. Deseja realmente voltar?
      </ConfirmDialog>

      <Snackbar
        open={snackState.open}
        autoHideDuration={6000}
        onClose={handleSnackClose}
      >
        <Alert onClose={handleSnackClose} severity={snackState.severity}>
          {snackState.message}
        </Alert>
      </Snackbar>

      <Toolbar className={classes.toolbar}>
        <h1>Novo Evento</h1>
      </Toolbar>
      
        <form className={classes.form} onSubmit={handleSubmit}>
        <h2>1. Onde o evento vai acontecer</h2>
        <TextField
          id="logradouro"
          label="Logradouro"
          fullWidth
          required
          variant="filled"
          value={cliente.logradouro}
          inputProps={{ maxLength: 100 }}
          onChange={handleInputChange}
        />
        <TextField
          id="num_imovel"
          label="Número"
          fullWidth
          required
          variant="filled"
          value={cliente.num_imovel}
          inputProps={{ maxLength: 10 }}
          onChange={handleInputChange}
        />
        <TextField
          id="complemento"
          label="Complemento"
          variant="filled"
          fullWidth
          value={cliente.complemento}
          inputProps={{ maxLength: 30 }}
          onChange={handleInputChange}
        />
        <TextField
          id="bairro"
          label="Bairro"
          fullWidth
          required
          variant="filled"
          value={cliente.bairro}
          inputProps={{ maxLength: 50 }}
          onChange={handleInputChange}
        />
        <TextField
          id="municipio"
          label="Município"
          fullWidth
          required
          variant="filled"
          value={cliente.municipio}
          inputProps={{ maxLength: 50 }}
          onChange={handleInputChange}
        />
        <TextField
          id="uf"
          label="UF"
          fullWidth
          required
          select
          variant="filled"
          value={cliente.uf}
          onChange={(event) => handleInputChange(event, "uf")}
        >
          <MenuItem value="AC">AC</MenuItem>
          <MenuItem value="AL">AL</MenuItem>
          <MenuItem value="AP">AP</MenuItem>
          <MenuItem value="AM">AM</MenuItem>
          <MenuItem value="BA">BA</MenuItem>
          <MenuItem value="CE">CE</MenuItem>
          <MenuItem value="DF">DF</MenuItem>
          <MenuItem value="ES">ES</MenuItem>
          <MenuItem value="GO">GO</MenuItem>
          <MenuItem value="MA">MA</MenuItem>
          <MenuItem value="MT">MT</MenuItem>
          <MenuItem value="MS">MS</MenuItem>
          <MenuItem value="MG">MG</MenuItem>
          <MenuItem value="PA">PA</MenuItem>
          <MenuItem value="PB">PB</MenuItem>
          <MenuItem value="PR">PR</MenuItem>
          <MenuItem value="PE">PE</MenuItem>
          <MenuItem value="PI">PI</MenuItem>
          <MenuItem value="RJ">RJ</MenuItem>
          <MenuItem value="RN">RN</MenuItem>
          <MenuItem value="RS">RS</MenuItem>
          <MenuItem value="RO">RO</MenuItem>
          <MenuItem value="RR">RR</MenuItem>
          <MenuItem value="SC">SC</MenuItem>
          <MenuItem value="SP">SP</MenuItem>
          <MenuItem value="SE">SE</MenuItem>
          <MenuItem value="TO">TO</MenuItem>
        </TextField>
              
        <h2>2. Informações do evento</h2>
              
        <TextField
          id="nomeDoEvento"
          label="Nome do evento"
          fullWidth
          required
          variant="filled"
          value={cliente.nomeDoEvento}
          inputProps={{ maxLength: 100 }}
          onChange={handleInputChange}
        />
        <TextField
          id="assuntoDoEvento"
          label="Assunto do evento"
          fullWidth
          required
          variant="filled"
          value={cliente.assuntoDoEvento}
          inputProps={{ maxLength: 100 }}
          onChange={handleInputChange}
        />
        <InputMask
          id="dataDoEvento"
          formatChars={formatChars}
          mask={dateMask}
          value={cliente.dataDoEvento}
          onChange={(event) => handleInputChange(event, "dataDoEvento")}
        >
          {() => (
            <TextField label="Data do Evento" variant="filled" fullWidth required />
          )}
        </InputMask>
        
        <TextField 
          id="descricaoDoEvento"
          placeholder="Descrição do Evento"
          fullWidth
          required
          multiline
          variant="filled"
          value={cliente.descricaoDoEvento}
          onChange={handleInputChange} 
        />   
        
        <h2>3. Informações do produtor</h2>
        
              <TextField
                  id="nomeDoProdutor"
                  label="Nome do produtor"
                  fullWidth
                  required
                  variant="filled"
                  value={cliente.nomeDoProdutor}
                  inputProps={{ maxLength: 100 }}
                  onChange={handleInputChange}
              />
              <TextField
                  id="emailDoProdutor"
                  label="Email do produtor"
                  fullWidth
                  required
                  variant="filled"
                  value={cliente.emailDoProdutor}
                  inputProps={{ maxLength: 100 }}
                  onChange={handleInputChange}
              />
              <InputMask
                    id="telefoneDoProdutor"
                    formatChars={formatChars}
                    mask={telMask}
                    value={cliente.telefoneDoProdutor}
                    onChange={event => handleInputChange(event, 'telefone')}
                >
                    {() => <TextField label="Telefone do produtor" variant="filled" fullWidth required />}
                </InputMask>

        <Toolbar className={classes.toolbar}>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={btnSendState.disabled}
          >
            {btnSendState.label}
          </Button>
          <Button variant="outlined" onClick={handleGoBack}>
            Voltar
          </Button>
        </Toolbar>
      </form>
    </>
  );
}
