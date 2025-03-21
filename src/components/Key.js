import React from 'react';
import { Button } from '@mui/material';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import BackspaceIcon from '@mui/icons-material/Backspace';
import SpaceBarIcon from '@mui/icons-material/SpaceBar';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import Brightness2Icon from '@mui/icons-material/Brightness2';

const Key = ({ label, onClick, isSpecial, isShiftActive, isDarkTheme }) => {
  const playSound = () => {
    const audio = new Audio('/key-click.mp3');
    audio.play().catch((error) => {
      console.error('Erro ao tocar o som:', error);
    });
  };

  const handleClick = () => {
    playSound();
    onClick(label);
  };

  const renderIcon = () => {
    switch (label) {
      case 'Enter':
        return <KeyboardReturnIcon sx={{ fontSize: { xs: '16px', sm: '20px' } }} />;
      case 'Shift':
        return <ArrowUpwardIcon sx={{ fontSize: { xs: '16px', sm: '20px' } }} />;
      case 'Backspace':
        return <BackspaceIcon sx={{ fontSize: { xs: '16px', sm: '20px' } }} />;
      case 'Space':
        return <SpaceBarIcon sx={{ fontSize: { xs: '16px', sm: '20px' } }} />;
      case 'Theme':
        return isDarkTheme ? (
          <WbSunnyIcon sx={{ fontSize: { xs: '16px', sm: '20px' } }} />
        ) : (
          <Brightness2Icon sx={{ fontSize: { xs: '16px', sm: '20px' } }} />
        );
      default:
        return null;
    }
  };

  return (
    <Button
      variant="contained"
      onClick={handleClick}
      sx={{
        minWidth: {
          xs: isSpecial ? '50px' : '40px',
          sm: isSpecial ? '70px' : '50px',
        },
        height: { xs: '40px', sm: '50px' },
        margin: '2px',
        padding: { xs: '5px', sm: '10px' },
        fontSize: { xs: '14px', sm: '16px' },
        backgroundColor: isShiftActive
          ? 'rgba(74, 144, 226, 0.8)'
          : label === 'Enter' && !isShiftActive
          ? 'rgba(74, 144, 226, 0.8)'
          : isSpecial
          ? 'rgba(44, 62, 80, 0.8)'
          : 'rgba(52, 73, 94, 0.8)',
        color: '#d3d9e0',
        borderRadius: '8px',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.3)',
        '&:hover': {
          backgroundColor: isShiftActive
            ? 'rgba(90, 160, 242, 0.8)'
            : label === 'Enter' && !isShiftActive
            ? 'rgba(90, 160, 242, 0.8)'
            : isSpecial
            ? 'rgba(60, 78, 96, 0.8)'
            : 'rgba(68, 89, 110, 0.8)',
        },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '5px',
        /* Adiciona transição suave para mudanças de tamanho e cor */
        transition: 'all 0.3s ease-in-out',
      }}
    >
      {renderIcon()}
      {!renderIcon() && label}
    </Button>
  );
};

export default Key;