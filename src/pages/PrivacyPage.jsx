export default function PrivacyPage() {
  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '24px 16px', fontFamily: 'inherit', color: '#1f2937', lineHeight: 1.7 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Политика конфиденциальности</h1>
      <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 24 }}>Приложение ForWork — для исполнителей Стандарт Экспресс</p>

      <h2 style={{ fontSize: 16, fontWeight: 600, marginTop: 24, marginBottom: 8 }}>Оператор данных</h2>
      <p>ООО «Стандарт Экспресс», г. Казань.</p>

      <h2 style={{ fontSize: 16, fontWeight: 600, marginTop: 24, marginBottom: 8 }}>Какие данные мы собираем</h2>
      <ul style={{ paddingLeft: 20, margin: 0 }}>
        <li>Фамилия, имя, отчество</li>
        <li>Номер телефона</li>
        <li>Telegram ID</li>
        <li>Город (определяется при регистрации)</li>
        <li>Возраст</li>
        <li>Статус самозанятости</li>
      </ul>

      <h2 style={{ fontSize: 16, fontWeight: 600, marginTop: 24, marginBottom: 8 }}>Как мы используем данные</h2>
      <p>Данные используются исключительно для идентификации исполнителя в системе и назначения заказов. Без этих данных использование приложения невозможно.</p>

      <h2 style={{ fontSize: 16, fontWeight: 600, marginTop: 24, marginBottom: 8 }}>Передача третьим лицам</h2>
      <p>Мы не передаём ваши персональные данные третьим лицам.</p>

      <h2 style={{ fontSize: 16, fontWeight: 600, marginTop: 24, marginBottom: 8 }}>Удаление данных</h2>
      <p>Вы можете удалить свой аккаунт и все связанные данные в любой момент через раздел «Профиль» в приложении. После удаления аккаунта все ваши персональные данные будут безвозвратно удалены из нашей системы.</p>

      <h2 style={{ fontSize: 16, fontWeight: 600, marginTop: 24, marginBottom: 8 }}>Хранение данных</h2>
      <p>Данные хранятся на защищённых серверах. Доступ к данным имеют только сотрудники компании, которым это необходимо для выполнения рабочих задач.</p>

      <p style={{ marginTop: 32, fontSize: 12, color: '#9ca3af' }}>Последнее обновление: июнь 2026 г.</p>
    </div>
  )
}
