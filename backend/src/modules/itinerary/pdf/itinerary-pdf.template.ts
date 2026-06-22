export interface PdfDay {
  dayNumber: number;
  cityName: string;
  nightsCount: number;
  notes?: string;
  distanceFromPrevKm?: number;
  travelTime?: { hours: number; minutes: number };
}

export interface PdfData {
  title: string;
  days: PdfDay[];
  totalDistance: number;
  totalNights: number;
  generatedAt: string;
}

export function renderPdfHtml(data: PdfData): string {
  const rows = data.days
    .map((day, i) => {
      const travel =
        i > 0 && day.distanceFromPrevKm != null
          ? `<span class="travel">${day.distanceFromPrevKm} km — ${day.travelTime?.hours || 0}h${day.travelTime?.minutes || 0}</span>`
          : '<span class="travel start">Départ</span>';
      const notes = day.notes ? `<p class="notes">${escapeHtml(day.notes)}</p>` : '';

      return `
        <tr>
          <td class="day-num">Jour ${day.dayNumber}</td>
          <td class="city"><strong>${escapeHtml(day.cityName)}</strong> — ${day.nightsCount} nuit${day.nightsCount > 1 ? 's' : ''}</td>
          <td class="travel-cell">${travel}</td>
        </tr>
        ${notes ? `<tr><td></td><td colspan="2">${notes}</td></tr>` : ''}
      `;
    })
    .join('');

  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <style>
    @page { margin: 20mm 15mm; }
    body {
      font-family: 'Helvetica', 'Arial', sans-serif;
      color: #3d352c;
      font-size: 12px;
      line-height: 1.5;
    }
    .header {
      text-align: center;
      padding-bottom: 20px;
      border-bottom: 3px solid #c8613c;
      margin-bottom: 24px;
    }
    .header h1 {
      font-size: 22px;
      color: #c8613c;
      margin: 0 0 4px;
    }
    .header .meta {
      font-size: 13px;
      color: #8a7f6e;
    }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    th {
      text-align: left;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #8a7f6e;
      padding: 8px 4px;
      border-bottom: 1px solid #e4dbcc;
    }
    td {
      padding: 12px 4px;
      border-bottom: 1px solid #f0ece4;
      vertical-align: top;
    }
    .day-num {
      width: 80px;
      font-weight: 600;
      color: #c8613c;
    }
    .city { width: auto; }
    .travel-cell { width: 140px; text-align: right; }
    .travel {
      font-size: 11px;
      color: #8a7f6e;
    }
    .travel.start {
      color: #2d8a4e;
      font-weight: 600;
    }
    .notes {
      font-size: 11px;
      color: #5a4a3a;
      font-style: italic;
      margin: 4px 0 0;
    }
    .footer {
      margin-top: 32px;
      text-align: center;
      font-size: 10px;
      color: #b8a99a;
    }
    .stats {
      display: flex;
      justify-content: center;
      gap: 32px;
      margin: 20px 0;
      padding: 16px;
      background: #fefcf8;
      border: 1px solid #e4dbcc;
      border-radius: 8px;
    }
    .stat {
      text-align: center;
    }
    .stat-value {
      font-size: 18px;
      font-weight: 700;
      color: #c8613c;
    }
    .stat-label {
      font-size: 10px;
      color: #8a7f6e;
      text-transform: uppercase;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>${escapeHtml(data.title)}</h1>
    <div class="meta">${data.totalNights} nuits · ${data.totalDistance} km · généré le ${data.generatedAt}</div>
  </div>

  <div class="stats">
    <div class="stat">
      <div class="stat-value">${data.totalNights}</div>
      <div class="stat-label">Nuits</div>
    </div>
    <div class="stat">
      <div class="stat-value">${data.days.length}</div>
      <div class="stat-label">Étapes</div>
    </div>
    <div class="stat">
      <div class="stat-value">${data.totalDistance}</div>
      <div class="stat-label">Km</div>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Jour</th>
        <th>Ville</th>
        <th>Trajet</th>
      </tr>
    </thead>
    <tbody>
      ${rows}
    </tbody>
  </table>

  <div class="footer">
    Dyarna — Découvrez le Maroc · généré par ${escapeHtml(data.title)}
  </div>
</body>
</html>`;
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
