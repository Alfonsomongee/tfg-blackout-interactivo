import React from 'react';
import { METHODOLOGY_DATA } from './citations';

export const SourcesTable: React.FC = () => {
  return (
    <div className="sources-table-wrapper">
      <h4 className="sources-table-title">Instituciones Analizadas</h4>

      <table className="sources-table">
        <thead>
          <tr>
            <th>Institución</th>
            <th>Rol</th>
            <th>Informe</th>
          </tr>
        </thead>
        <tbody>
          {METHODOLOGY_DATA.sources.map((source) => (
            <tr key={source.institution}>
              <td className="source-institution">
                <a href={source.url} target="_blank" rel="noopener noreferrer">
                  {source.institution}
                </a>
                <span className="source-fullname">{source.fullName}</span>
              </td>
              <td className="source-role">{source.role}</td>
              <td className="source-report">{source.report}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
