import React from 'react';
import './DownloadPanel.scss';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { removeAll } from '../../store/selectedPokemonsSlice';
import Papa from 'papaparse';

const DownloadPanel: React.FC = () => {
  const dispatch = useDispatch();
  const selectedPokemons = useSelector(
    (state: RootState) => state.selectedPokemons.selectedPokemons
  );

  const unselectAll = () => {
    dispatch(removeAll());
  };

  const download = () => {
    const pokemons = selectedPokemons.map((pokemon) => {
      return {
        ...pokemon,
        types: pokemon.types.map((type) => type.type.name).join(', '),
        abilities: pokemon.abilities
          .map((ability) => ability.ability.name)
          .join(', '),
      };
    });

    const csv = Papa.unparse(pokemons);

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = URL.createObjectURL(blob);
    const a = document.createElement('a');

    a.href = link;
    a.download = `${selectedPokemons.length}_pokemons.csv`;
    a.click();
  };

  return (
    <div className="download-panel">
      <p>
        <b>{selectedPokemons.length}</b> items are selected
      </p>
      <button onClick={unselectAll}>Unselect All</button>
      <button onClick={download}>Download</button>
    </div>
  );
};

export default DownloadPanel;
