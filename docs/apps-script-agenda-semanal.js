const SPREADSHEET_ID = '1wpgb3P7oP-eTJiPOoRq_QwYPi1FsiAseIUnlgIyJ1po';
const SHEET_NAME = '';

function doGet() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = SHEET_NAME
    ? spreadsheet.getSheetByName(SHEET_NAME)
    : spreadsheet.getSheets()[0];
  const values = sheet.getDataRange().getDisplayValues();
  const metadata = readMetadata(values);
  const agenda = readAgenda(values, metadata.month);

  return ContentService
    .createTextOutput(JSON.stringify({
      week: metadata.week,
      period: metadata.period,
      month: metadata.month,
      agenda
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

function readMetadata(values) {
  return {
    week: values[0]?.[1] || '',
    period: values[1]?.[1] || '',
    month: values[2]?.[1] || ''
  };
}

function readAgenda(values, month) {
  const rows = values.slice(4);
  const agendaByDate = [];
  let currentDay = '';
  let currentDate = '';

  rows.forEach((row) => {
    const day = row[0] || currentDay;
    const dateNumber = row[1] || currentDate;
    const activity = row[2];

    if (!activity) return;

    currentDay = day;
    currentDate = dateNumber;

    const dateLabel = [day, dateNumber, month ? `de ${month}` : '']
      .filter(Boolean)
      .join(' ');

    let agendaDay = agendaByDate.find((item) => item.date === dateLabel);

    if (!agendaDay) {
      agendaDay = {
        date: dateLabel,
        activities: []
      };
      agendaByDate.push(agendaDay);
    }

    agendaDay.activities.push({
      activity,
      responsible: row[3] || '',
      participants: row[4] || '',
      place: row[5] || ''
    });
  });

  return agendaByDate;
}
