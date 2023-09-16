import type { Keyset } from '../types'

export default {
  LANG_NATIVE_NAME: 'Polski',
  Next: 'Następny',
  Country: 'Kraj',
  Code: 'Kod',
  PhoneNumber: 'Numer telefonu',
  RememberMe: 'Zapamiętaj mnie',
  Password: 'Hasło',
  'WrongNumber?': 'Zły numer?',
  YourName: 'Twoje imię',
  Name: 'Imię',
  NewChannel: 'Nowy kanał',
  NewGroup: 'Nowa grupa',
  NewPrivateChat: 'Nowa wiadomość',
  LastNameOptional: 'Nazwisko ( opcjonalnie )',
  Search: 'Wyszukiwanie',
  SavedMessages: 'Zapisane',
  Contacts: 'Contacts',
  Settings: 'Ustawienia',
  Animations: 'Animacje',
  DarkMode: 'Tryb ciemny',
  InstallApp: 'Zainstaluj aplikację',
  SourceCode: 'Kod źródłowy',
  'Auth.Signin': 'Zaloguj się do Prechat',
  'Auth.ConfirmNumber': 'Potwierdź swój kraj i wprowadź numer telefonu.',
  'Auth.ContinueOnLanguage': 'Ciąg dalszy w polskim',
  'Auth.CodeSendOnApp': 'Wysłaliśmy kod do aplikacji **Prechat** na drugim urządzeniu.',
  'Auth.CodeSendOnPhone': 'Wysłaliśmy kod na Twój telefon komórkowy',
  'Auth.EnterPassword': 'Wprowadź hasło',
  'Auth.Password': 'Twoje konto jest chronione dodatkowym hasłem.',
  'Auth.SignUp': 'Wprowadź swoje imię i nazwisko oraz dodaj zdjęcie profilowe',
  'Auth.SilentAuth': 'Cichy (bez powiadamiania kontaktów)',
  'Auth.StartMessaging': 'Rozpoczęcie komunikacji',

  'Error.UNAUTHORIZED':
    'Twoje żądanie nie może zostać przetworzone z powodu braku autoryzacji. Zaloguj się, aby uzyskać dostęp.',
  'Error.AUTH_SESSION_TOO_FRESH':
    'Operacja nie może zostać wykonana, ponieważ sesja ma mniej niż jeden dzień. Ze względów bezpieczeństwa sesje muszą mieć co najmniej 24 godziny.',
  'Error.AUTH_SESSION_EXPIRED':
    'Twoja sesja nie jest już ważna, ponieważ wygasła. Zaloguj się, aby ponownie aktywować sesję.',
  'Error.AUTH_SESSION_INVALID':
    'System nie mógł zalogować użytkownika przy użyciu podanej sesji. Może być ona uszkodzona lub nieaktualna.',
  'Error.AUTH_VERIFY_CODE': 'Błąd sprawdzania poprawności kodu Firebase.',
  'Error.AUTH_SESSION_PASSWORD_NEEDED': 'Wymagane hasło.',
  'Error.PHONE_NUMBER_NOT_FOUND': 'Numer telefonu nie jest zarejestrowany.',
  'Error.PHONE_NUMBER_INVALID': 'Podany numer telefonu jest nieprawidłowy. Sprawdź numer i spróbuj ponownie.',
  'Error.PHONE_NUMBER_REGISTERED': 'Numer telefonu jest już zarejestrowany. Spróbuj użyć innego numeru.',
  'Error.QUERY_IS_EMPTY': 'Zapytanie wyszukiwania jest puste.',
  'Error.INVALID_ID': 'Podany identyfikator podmiotu jest nieprawidłowy.',
  'Error.FORBIDDEN': 'Nie masz uprawnień dostępu.',
  'Error.NOT_FOUND_ENTITY': 'Podmiot nie został znaleziony przy użyciu dostarczonych danych.',
  'Error.BAD_REQUEST': 'Zła prośba.',
  'Error.CONTACT_EXIST': 'Kontakt został już utworzony.',
  'Error.CONTACT_NAME_EMPTY': 'Nazwa kontaktu jest pusta.',
  HelloInterpolate: 'Morgen, {{name}}',
  HelloPluralize: {
    one: 'Witam, 1 element',
    few: 'Witam, 2 elementy',
    many: 'Witam, {{count}} elementów',
  },
  CombinedPlurAndInter: {
    one: 'Hello, {{name}}, you have 1 item',
    few: 'Witam, {{name}}, {{count}} elementy',
    other: 'Witam, {{name}}, {{count}} elementów',
  },
  'Notification.CreatedChatWithTitle': '{{name}} utworzył grupę "{{title}}"',
  'Notification.CreatedChannel': 'Utworzony kanał',
} satisfies Keyset
