import React, { useState, useEffect } from 'react';
import TextArea from './TextArea';
import './AddItemModal.css';
import Tesseract from 'tesseract.js';
import { BrowserMultiFormatReader } from '@zxing/browser';

const AddItemModal = ({
  onClose,
  inputValue,
  setInputValue,
  onAddItem,
  quantity,
  setQuantity,
  price,
  setPrice,
  isEditing,
  photoUrl,
}) => {
  const [barcode, setBarcode] = useState('');
  const [scannedItem, setScannedItem] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [unitType, setUnitType] = useState('unit');
  const [weight, setWeight] = useState('');
  const [total, setTotal] = useState('R$ 0,00');
  const [isScanning, setIsScanning] = useState(false);

  // Ref para input file
  const fileInputRef = React.useRef();

  // Mock de escaneamento de código de barras
  const handleScanBarcode = async () => {
    setIsScanning(true);
    const codeReader = new BrowserMultiFormatReader();
    try {
      const result = await codeReader.decodeOnceFromVideoDevice(
        undefined,
        'barcode-video'
      );
      setBarcode(result.text);
      setIsScanning(false);
      // Aqui você buscaria no Firebase pelo código de barras e preencheria os campos
      // Se não encontrar, permite cadastro manual
      // Exemplo:
      // const produto = await buscarProdutoNoFirebase(result.text);
      // if (produto) {
      //   setInputValue(produto.name.toUpperCase());
      //   setPrice(produto.price);
      //   setUnitType(produto.unit);
      // } else {
      //   setInputValue('');
      //   setPrice('');
      //   setUnitType('unit');
      // }
    } catch (err) {
      alert('Não foi possível ler o código de barras. Tente novamente.');
      setIsScanning(false);
    } finally {
      codeReader.reset();
    }
  };

  const handleCancelScan = () => {
    setIsScanning(false);
    const video = document.getElementById('barcode-video');
    if (video && video.srcObject) {
      video.srcObject.getTracks().forEach(track => track.stop());
      video.srcObject = null;
    }
  };

  // Mock de tirar foto
  const handleTakePhoto = async e => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
      // OCR com Tesseract
      const {
        data: { text },
      } = await Tesseract.recognize(file, 'por');
      const lines = text
        .split('\n')
        .map(l => l.trim())
        .filter(Boolean);
      // Sugestão simples: primeira linha = nome, primeira linha com R$ ou número = valor
      const nome = (lines[0] || '').toUpperCase();
      const valor = (lines.find(l => l.match(/\d+[,.]\d{2}/)) || '').replace(
        /[^\d,\.]/g,
        ''
      );
      setInputValue(nome);
      setPrice(valor.replace(',', '.'));
      // Unidade: procura por ml, kg, g, etc
      const unidade = (
        lines.find(l => l.match(/\b(ml|kg|g|un|l)\b/i)) || ''
      ).toUpperCase();
      if (unidade) setUnitType(unidade);
    }
  };

  // Botão para acionar input file
  const handlePhotoButtonClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleAddItem = () => {
    onAddItem(collectItemData());
    onClose();
  };

  // Handler para fechar modal via teclado
  const handleOverlayKeyDown = e => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  useEffect(() => {
    // Limpa campos ao fechar modal
    if (!isEditing && !inputValue) {
      setUnitType('unit');
      setWeight('');
      setPhoto(null);
      setPhotoPreview(null);
      setBarcode('');
      setScannedItem(null);
      setTotal('R$ 0,00');
    }
  }, [onClose]);

  // Função para coletar todos os dados do item
  const collectItemData = () => {
    return {
      text: inputValue,
      quantity,
      value: price,
      unitType,
      weight,
      barcode,
      photoUrl,
    };
  };

  // Expor função para App.jsx via ref ou window (workaround para botão fixo)
  useEffect(() => {
    window.__getAddItemData = collectItemData;
  });

  return (
    <div
      className='modal-overlay'
      aria-label='Fechar modal'
      onClick={onClose}
      role='button'
      tabIndex={0}
      onKeyDown={handleOverlayKeyDown}
    >
      <div
        className='modal-content'
        onClick={e => e.stopPropagation()}
        role='presentation'
        onKeyDown={() => {}}
      >
        {/* Exibe o vídeo da câmera no topo durante o scan */}
        {isScanning && (
          <div
            style={{
              width: '100%',
              marginBottom: 16,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <video
              id='barcode-video'
              style={{ width: '100%', maxWidth: 320, borderRadius: 12 }}
              autoPlay
            >
              <track kind='captions' />
            </video>
            <button
              onClick={handleCancelScan}
              style={{ marginTop: 8 }}
              className='scan-barcode-btn'
            >
              Cancelar
            </button>
          </div>
        )}
        <header className='modal-header'>
          <h3>{isEditing ? 'Editar Item' : 'Adicionar Novo Item'}</h3>
          <button onClick={onClose} className='close-btn' aria-label='Fechar'>
            &times;
          </button>
        </header>
        <div className='modal-body'>
          {/* Campo de código de barras com foto */}
          <div
            className='barcode-photo-row'
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              marginBottom: 20,
            }}
          >
            <div
              className='photo-square'
              style={{
                width: 80,
                height: 80,
                borderRadius: 12,
                background: '#232b3b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                border: '2px solid #3a425a',
              }}
            >
              {photoUrl ? (
                <img
                  src={photoUrl}
                  alt='Foto do produto'
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <span
                  style={{
                    color: '#b7bed6',
                    fontSize: 28,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <svg
                    width='32'
                    height='32'
                    fill='none'
                    stroke='#b7bed6'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    viewBox='0 0 24 24'
                  >
                    <circle cx='12' cy='12' r='3.2' />
                    <path d='M2.5 7.5V17a2.5 2.5 0 0 0 2.5 2.5h14a2.5 2.5 0 0 0 2.5-2.5V7.5M16 7.5V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2.5' />
                  </svg>
                  Foto
                </span>
              )}
            </div>
            <div
              style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8 }}
            >
              <input
                id='barcode-input'
                type='text'
                value={barcode}
                onChange={e => setBarcode(e.target.value)}
                placeholder='Escaneie ou digite o código'
                style={{ marginRight: 8, flex: 1 }}
              />
              <button
                type='button'
                onClick={handleScanBarcode}
                className='scan-barcode-btn'
              >
                Escanear
              </button>
            </div>
          </div>
          {scannedItem && (
            <div className='scanned-item-info'>
              <strong>Item encontrado:</strong> {scannedItem.name} (
              {scannedItem.brand})
            </div>
          )}

          {/* Botão para tirar foto do item/preço */}
          <div className='photo-section'>
            <label htmlFor='photo-input'>Foto do item/preço</label>
            {/* Botão que aciona o input de arquivo e dispara o OCR via Tesseract.js */}
            <button
              id='photo-input-btn'
              type='button'
              className='scan-barcode-btn'
              onClick={handlePhotoButtonClick}
              aria-labelledby='photo-input'
            >
              Tirar Foto do Item/Preço
            </button>
            <input
              ref={fileInputRef}
              id='photo-input'
              type='file'
              accept='image/*'
              capture='environment'
              onChange={handleTakePhoto}
              style={{ display: 'none' }}
            />
          </div>

          {/* Fallback para cadastro manual */}
          <TextArea
            value={inputValue}
            setValue={setInputValue}
            quantity={quantity}
            setQuantity={setQuantity}
            price={price}
            setPrice={setPrice}
            unitType={unitType}
            setUnitType={setUnitType}
            weight={weight}
            setWeight={setWeight}
            onEnter={handleAddItem}
            isEditing={isEditing}
            onTotalChange={setTotal}
          />
          <div
            className='total-display'
            style={{ margin: '24px 0 0 0', borderRadius: 10 }}
          >
            Total: {total}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddItemModal;
