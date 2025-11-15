"""
Google API integrations for extracting company data
Supports Gmail, Google Drive, and Google Sheets
"""
import os
import pickle
from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

# If modifying these scopes, delete the file token.json.
SCOPES = [
    'https://www.googleapis.com/auth/gmail.readonly',
    'https://www.googleapis.com/auth/drive.readonly',
    'https://www.googleapis.com/auth/spreadsheets.readonly'
]


class GoogleIntegrationManager:
    """Manages all Google API integrations"""

    def __init__(self, credentials_path: str = 'credentials.json', token_path: str = 'token.json'):
        self.credentials_path = credentials_path
        self.token_path = token_path
        self.creds = None
        self._authenticate()

    def _authenticate(self):
        """Authenticate with Google OAuth"""
        # The file token.json stores the user's access and refresh tokens
        if os.path.exists(self.token_path):
            self.creds = Credentials.from_authorized_user_file(self.token_path, SCOPES)

        # If there are no (valid) credentials available, let the user log in
        if not self.creds or not self.creds.valid:
            if self.creds and self.creds.expired and self.creds.refresh_token:
                self.creds.refresh(Request())
            else:
                if not os.path.exists(self.credentials_path):
                    raise FileNotFoundError(
                        f"Credentials file not found: {self.credentials_path}\n"
                        "Please download OAuth credentials from Google Cloud Console"
                    )
                flow = InstalledAppFlow.from_client_secrets_file(
                    self.credentials_path, SCOPES)
                self.creds = flow.run_local_server(port=0)

            # Save the credentials for the next run
            with open(self.token_path, 'w') as token:
                token.write(self.creds.to_json())

    def get_gmail_service(self):
        """Get Gmail API service"""
        return build('gmail', 'v1', credentials=self.creds)

    def get_drive_service(self):
        """Get Drive API service"""
        return build('drive', 'v3', credentials=self.creds)

    def get_sheets_service(self):
        """Get Sheets API service"""
        return build('sheets', 'v4', credentials=self.creds)


class GmailExtractor:
    """Extract company information from Gmail"""

    def __init__(self, service):
        self.service = service

    def extract_business_emails(self, max_results: int = 100, days_back: int = 365) -> List[Dict[str, Any]]:
        """Extract business-related emails"""
        try:
            # Calculate date for filtering
            since_date = datetime.now() - timedelta(days=days_back)
            query = f'after:{since_date.strftime("%Y/%m/%d")} (subject:client OR subject:proposal OR subject:contract OR subject:invoice OR subject:meeting OR from:*@mabaistrategies.com)'

            results = self.service.users().messages().list(
                userId='me',
                q=query,
                maxResults=max_results
            ).execute()

            messages = results.get('messages', [])
            emails = []

            for msg in messages:
                try:
                    message = self.service.users().messages().get(
                        userId='me',
                        id=msg['id'],
                        format='metadata',
                        metadataHeaders=['From', 'To', 'Subject', 'Date']
                    ).execute()

                    headers = {h['name']: h['value'] for h in message['payload']['headers']}

                    emails.append({
                        'id': msg['id'],
                        'from': headers.get('From', ''),
                        'to': headers.get('To', ''),
                        'subject': headers.get('Subject', ''),
                        'date': headers.get('Date', ''),
                        'snippet': message.get('snippet', '')
                    })
                except HttpError as e:
                    print(f"Error fetching message {msg['id']}: {e}")
                    continue

            return emails

        except HttpError as error:
            print(f'Gmail API error: {error}')
            return []

    def analyze_email_patterns(self, emails: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Analyze email patterns for business insights"""
        insights = {
            'total_emails': len(emails),
            'client_communications': 0,
            'proposals_sent': 0,
            'contracts_signed': 0,
            'meetings_scheduled': 0,
            'key_contacts': set(),
            'common_topics': []
        }

        for email in emails:
            subject = email.get('subject', '').lower()
            from_addr = email.get('from', '').lower()

            if 'client' in subject or 'customer' in subject:
                insights['client_communications'] += 1

            if 'proposal' in subject or 'quote' in subject:
                insights['proposals_sent'] += 1

            if 'contract' in subject or 'agreement' in subject:
                insights['contracts_signed'] += 1

            if 'meeting' in subject or 'schedule' in subject:
                insights['meetings_scheduled'] += 1

            # Extract email domains as potential clients
            if '@' in from_addr and 'mabaistrategies' not in from_addr:
                domain = from_addr.split('@')[-1].split('>')[0]
                insights['key_contacts'].add(domain)

        insights['key_contacts'] = list(insights['key_contacts'])[:10]
        return insights


class DriveExtractor:
    """Extract company information from Google Drive"""

    def __init__(self, service):
        self.service = service

    def list_business_documents(self, max_results: int = 50) -> List[Dict[str, Any]]:
        """List business-related documents"""
        try:
            # Search for relevant business documents
            query = "(mimeType='application/pdf' OR mimeType='application/vnd.google-apps.document' OR mimeType='application/vnd.openxmlformats-officedocument.wordprocessingml.document') AND (fullText contains 'MAB AI' OR fullText contains 'strategy' OR fullText contains 'proposal' OR fullText contains 'client')"

            results = self.service.files().list(
                q=query,
                pageSize=max_results,
                fields="files(id, name, mimeType, createdTime, modifiedTime, size)"
            ).execute()

            files = results.get('files', [])
            return files

        except HttpError as error:
            print(f'Drive API error: {error}')
            return []

    def analyze_document_metadata(self, files: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Analyze document metadata for insights"""
        insights = {
            'total_documents': len(files),
            'document_types': {},
            'creation_timeline': [],
            'recent_activity': []
        }

        for file in files:
            mime_type = file.get('mimeType', 'unknown')
            doc_type = mime_type.split('.')[-1]
            insights['document_types'][doc_type] = insights['document_types'].get(doc_type, 0) + 1

            created = file.get('createdTime')
            if created:
                insights['creation_timeline'].append({
                    'name': file.get('name'),
                    'date': created
                })

        # Sort by creation time
        insights['creation_timeline'].sort(key=lambda x: x['date'], reverse=True)
        insights['recent_activity'] = insights['creation_timeline'][:10]

        return insights


class SheetsExtractor:
    """Extract company information from Google Sheets"""

    def __init__(self, service):
        self.service = service

    def find_business_spreadsheets(self, drive_service) -> List[str]:
        """Find business-related spreadsheets"""
        try:
            query = "mimeType='application/vnd.google-apps.spreadsheet' AND (name contains 'revenue' OR name contains 'client' OR name contains 'finance' OR name contains 'MAB')"

            results = drive_service.files().list(
                q=query,
                pageSize=20,
                fields="files(id, name)"
            ).execute()

            return results.get('files', [])

        except HttpError as error:
            print(f'Sheets search error: {error}')
            return []

    def extract_financial_data(self, spreadsheet_id: str) -> Dict[str, Any]:
        """Extract financial data from a spreadsheet"""
        try:
            # Try common sheet names for financial data
            sheet_names = ['Revenue', 'Finances', 'Income', 'Sales', 'Sheet1']
            data = {}

            for sheet_name in sheet_names:
                try:
                    range_name = f'{sheet_name}!A1:Z100'
                    result = self.service.spreadsheets().values().get(
                        spreadsheetId=spreadsheet_id,
                        range=range_name
                    ).execute()

                    values = result.get('values', [])
                    if values:
                        data[sheet_name] = values
                        break

                except HttpError:
                    continue

            return data

        except HttpError as error:
            print(f'Sheets extraction error: {error}')
            return {}


def extract_all_company_data() -> Dict[str, Any]:
    """
    Main function to extract all company data from Google services
    Returns a comprehensive dataset for analysis
    """
    try:
        manager = GoogleIntegrationManager()

        # Initialize extractors
        gmail_service = manager.get_gmail_service()
        drive_service = manager.get_drive_service()
        sheets_service = manager.get_sheets_service()

        gmail_extractor = GmailExtractor(gmail_service)
        drive_extractor = DriveExtractor(drive_service)
        sheets_extractor = SheetsExtractor(sheets_service)

        print("Extracting Gmail data...")
        emails = gmail_extractor.extract_business_emails()
        email_insights = gmail_extractor.analyze_email_patterns(emails)

        print("Extracting Drive documents...")
        documents = drive_extractor.list_business_documents()
        doc_insights = drive_extractor.analyze_document_metadata(documents)

        print("Extracting Sheets data...")
        spreadsheets = sheets_extractor.find_business_spreadsheets(drive_service)
        financial_data = {}
        if spreadsheets:
            # Extract from first relevant spreadsheet
            financial_data = sheets_extractor.extract_financial_data(spreadsheets[0]['id'])

        return {
            'extraction_date': datetime.now().isoformat(),
            'gmail': {
                'emails': emails,
                'insights': email_insights
            },
            'drive': {
                'documents': documents,
                'insights': doc_insights
            },
            'sheets': {
                'spreadsheets': spreadsheets,
                'financial_data': financial_data
            }
        }

    except FileNotFoundError as e:
        print(f"Google credentials not configured: {e}")
        return {
            'error': str(e),
            'extraction_date': datetime.now().isoformat(),
            'gmail': {'emails': [], 'insights': {}},
            'drive': {'documents': [], 'insights': {}},
            'sheets': {'spreadsheets': [], 'financial_data': {}}
        }
    except Exception as e:
        print(f"Error extracting company data: {e}")
        return {
            'error': str(e),
            'extraction_date': datetime.now().isoformat(),
            'gmail': {'emails': [], 'insights': {}},
            'drive': {'documents': [], 'insights': {}},
            'sheets': {'spreadsheets': [], 'financial_data': {}}
        }
