import { useState, useEffect } from 'react';
import ImageUpload from './imageupload';

const SignUp = () => {
  const [firstName, setFirstName] = useState('');
  const [secondName, setSecondName] = useState('');
  const [number, setNumber] = useState('');
  const [selectedFile, setSelectedFile] = useState();
  const [preview, setPreview] = useState();
  const [type, setType] = useState('osoba');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');

  const isInvalid =
    secondName === '' || firstName === '' || number === '' || !selectedFile;

  function isValidNip(nip) {
    if (typeof nip !== 'string') return false;

    nip = nip.replace(/[\ \-]/gi, '');
    let weight = [6, 5, 7, 2, 3, 4, 5, 6, 7];
    let sum = 0;
    let controlNumber = parseInt(nip.substring(9, 10));
    let weightCount = weight.length;
    for (let i = 0; i < weightCount; i++) {
      sum += parseInt(nip.substr(i, 1)) * weight[i];
    }
    console.log(sum % 11 === controlNumber);
    return sum % 11 === controlNumber;
  }

  function isValidPesel(pesel) {
    if (typeof pesel !== 'string') return false;

    let weight = [1, 3, 7, 9, 1, 3, 7, 9, 1, 3];
    let sum = 0;
    let controlNumber = parseInt(pesel.substring(10, 11));

    for (let i = 0; i < weight.length; i++) {
      sum += parseInt(pesel.substring(i, i + 1)) * weight[i];
    }
    sum = sum % 10;
    console.log((10 - sum) % 10 === controlNumber);
    return (10 - sum) % 10 === controlNumber;
  }

  const handleSignUp = async e => {
    e.preventDefault();

    if (type === 'osoba') {
      if (!isValidPesel(number)) {
        setError('Niepoprawny format numeru pesel');
        return;
      }
    }
    if (type === 'firma') {
      if (!isValidNip(number)) {
        setError('Niepoprawny format numeru NIP');
        return;
      }
    }

    const formData = new FormData();
    const fileField = document.querySelector('input[type="file"]');

    formData.append('firstName', firstName);
    formData.append('secondName', secondName);
    formData.append(type === 'osoba' ? 'pesel' : 'nip', number);
    formData.append('avatar', fileField.files[0]);
    console.log(formData.get('avatar'));
    setIsSending(true);
    fetch('https://localhost:60001/Contractor/Save', {
      method: 'POST',
      body: formData,
    })
      .then(response => response.json())
      .then(result => {
        console.log('Success:', result);
      })
      .catch(error => {
        console.error('Error:', error);
        setIsSending(false);
        setError('Nie znaleziono metody zapisu');
      });
  };

  useEffect(() => {
    document.title = 'Contractor App';
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setError('');
    }, 3000);
    return () => clearTimeout(timer);
  }, [error]);

  return (
    <div className=" mx-auto h-screen flex flex-col justify-center items-center">
      <div className="w-4/5 max-w-[412px] bg-gray-400 rounded-md shadow-xl mx-auto">
        <div className="w-11/12 mx-auto px-3">
          <h1 className="font-spartan font-bold text-2xl text-gray-700 tracking-wide my-4 py-2 mt-6">
            Dodaj Kontrahenta
          </h1>

          {error && (
            <p className="font-spartan font-bold text-md pb-2 text-red-600">
              {error}
            </p>
          )}

          <form onSubmit={handleSignUp} className="font-spartan">
            <input
              type="text"
              placeholder="Imię"
              maxlength="30"
              className="  w-full mb-6 py-3 px-3 text-gray-700 rounded-md font-bold focus:outline-none shadow-md bg-gray-300"
              onChange={({ target }) => setFirstName(target.value)}
              value={firstName}
            />
            <input
              type="text"
              placeholder="Nazwisko"
              maxlength="30"
              className="  w-full py-3 px-3 text-gray-700 rounded-md font-bold focus:outline-none shadow-md bg-gray-300"
              onChange={({ target }) => setSecondName(target.value)}
              value={secondName}
            />

            <div className="font-bold text-gray-700 my-2 flex items-center justify-around  h-[48px] tracking-wide px-4">
              <div className="py-1 font-spartan text-md font-bold ">
                <p>Wybierz typ:</p>
              </div>
              <div className="px-2">
                <input
                  checked={type === 'osoba'}
                  onChange={e => setType(e.target.value)}
                  type="radio"
                  value="osoba"
                />{' '}
                Osoba
              </div>
              <div className="px-2">
                <input
                  checked={type === 'firma'}
                  onChange={e => setType(e.target.value)}
                  type="radio"
                  value="firma"
                />{' '}
                Firma
              </div>
            </div>

            <input
              type="text"
              placeholder={type === 'osoba' ? 'Pesel' : 'NIP'}
              className="  w-full py-3 px-3 text-gray-700 rounded-md font-bold focus:outline-none shadow-md bg-gray-300"
              onChange={({ target }) => setNumber(target.value)}
              value={number}
            />

            <ImageUpload
              selectedFile={selectedFile}
              setSelectedFile={setSelectedFile}
              preview={preview}
              setPreview={setPreview}
            />

            <button
              disabled={isInvalid}
              type="submit"
              className={`btn py-3 mb-10  text-center bg-blue-300 w-full shadow-md font-bold rounded-md text-gray-700 tracking-wide focus:outline-none active:scale-95  hover:bg-blue-400 transition ${
                isInvalid && 'opacity-50 hover:bg-blue-300'
              }`}
            >
              Dodaj
            </button>
          </form>

          {isSending && (
            <div className="flex justify-center flex-row">
              <div className="lds-ellipsis">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignUp;
