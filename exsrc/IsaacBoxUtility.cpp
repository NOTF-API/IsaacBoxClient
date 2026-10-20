#define WIN32_LEAN_AND_MEAN
#ifndef _WIN32_WINNT
#define _WIN32_WINNT 0x0601
#endif

#include <windows.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <wchar.h>

#pragma comment(lib, "advapi32.lib")
#pragma comment(lib, "user32.lib")

#define GAME_EXE_NAME L"isaac-ng.exe"

static wchar_t g_gamePath[MAX_PATH * 4];

static bool FileExistsW(const wchar_t* filePath) {
  DWORD attributes = GetFileAttributesW(filePath);
  return attributes != INVALID_FILE_ATTRIBUTES && (attributes & FILE_ATTRIBUTE_DIRECTORY) == 0;
}

static bool ReadRegistryString(HKEY root, const wchar_t* subKey, const wchar_t* valueName, wchar_t* value, DWORD valueChars) {
  HKEY key = NULL;
  if (RegOpenKeyExW(root, subKey, 0, KEY_READ, &key) != ERROR_SUCCESS) {
    return false;
  }
  DWORD type = 0;
  DWORD bytes = valueChars * sizeof(wchar_t);
  LONG result = RegQueryValueExW(key, valueName, NULL, &type, reinterpret_cast<LPBYTE>(value), &bytes);
  RegCloseKey(key);
  if (result != ERROR_SUCCESS || (type != REG_SZ && type != REG_EXPAND_SZ)) {
    return false;
  }
  value[valueChars - 1] = L'\0';
  if (type == REG_EXPAND_SZ) {
    wchar_t expanded[MAX_PATH * 4];
    DWORD expandedChars = ExpandEnvironmentStringsW(value, expanded, static_cast<DWORD>(_countof(expanded)));
    if (expandedChars > 0 && expandedChars <= _countof(expanded)) {
      wcscpy_s(value, valueChars, expanded);
    }
  }
  return value[0] != L'\0';
}

static void NormalizePath(wchar_t* filePath) {
  for (wchar_t* cursor = filePath; *cursor != L'\0'; ++cursor) {
    if (*cursor == L'/') {
      *cursor = L'\\';
    }
  }
  size_t length = wcslen(filePath);
  while (length > 0 && filePath[length - 1] == L'\\') {
    filePath[--length] = L'\0';
  }
}

static bool JoinPath(wchar_t* output, DWORD outputChars, const wchar_t* left, const wchar_t* right) {
  return swprintf_s(output, outputChars, L"%s\\%s", left, right) > 0;
}

static bool ReadTextFileW(const wchar_t* filePath, char** data) {
  HANDLE file = CreateFileW(filePath, GENERIC_READ, FILE_SHARE_READ | FILE_SHARE_WRITE, NULL, OPEN_EXISTING, FILE_ATTRIBUTE_NORMAL, NULL);
  if (file == INVALID_HANDLE_VALUE) {
    return false;
  }
  LARGE_INTEGER size;
  if (!GetFileSizeEx(file, &size) || size.QuadPart <= 0 || size.QuadPart > 1024 * 1024) {
    CloseHandle(file);
    return false;
  }
  DWORD bytes = static_cast<DWORD>(size.QuadPart);
  char* buffer = static_cast<char*>(malloc(bytes + 1));
  if (buffer == NULL) {
    CloseHandle(file);
    return false;
  }
  DWORD bytesRead = 0;
  BOOL ok = ReadFile(file, buffer, bytes, &bytesRead, NULL);
  CloseHandle(file);
  if (!ok) {
    free(buffer);
    return false;
  }
  buffer[bytesRead] = '\0';
  *data = buffer;
  return true;
}

static bool FindVdfValue(const char* text, const char* key, char* value, size_t valueSize) {
  char pattern[128];
  if (_snprintf_s(pattern, _countof(pattern), _TRUNCATE, "\"%s\"", key) <= 0) {
    return false;
  }
  const char* cursor = strstr(text, pattern);
  if (cursor == NULL) {
    return false;
  }
  cursor += strlen(pattern);
  while (*cursor == ' ' || *cursor == '\t' || *cursor == '\r' || *cursor == '\n') {
    ++cursor;
  }
  if (*cursor != '"') {
    return false;
  }
  ++cursor;
  size_t index = 0;
  while (*cursor != '\0' && *cursor != '"' && index + 1 < valueSize) {
    if (*cursor == '\\' && cursor[1] != '\0') {
      ++cursor;
    }
    value[index++] = *cursor++;
  }
  value[index] = '\0';
  return index > 0;
}

static bool Utf8ToWide(const char* input, wchar_t* output, int outputChars) {
  return MultiByteToWideChar(CP_UTF8, 0, input, -1, output, outputChars) > 0;
}

static bool FindGameInLibrary(const wchar_t* library) {
  wchar_t steamApps[MAX_PATH * 4];
  if (!JoinPath(steamApps, _countof(steamApps), library, L"steamapps")) {
    return false;
  }
  wchar_t commonDir[MAX_PATH * 4];
  if (!JoinPath(commonDir, _countof(commonDir), steamApps, L"common")) {
    return false;
  }
  wchar_t gameDir[MAX_PATH * 4];
  if (!JoinPath(gameDir, _countof(gameDir), commonDir, L"The Binding of Isaac Rebirth")) {
    return false;
  }
  wchar_t exePath[MAX_PATH * 4];
  if (JoinPath(exePath, _countof(exePath), gameDir, GAME_EXE_NAME) && FileExistsW(exePath)) {
    wcscpy_s(g_gamePath, _countof(g_gamePath), exePath);
    return true;
  }
  wchar_t manifestPath[MAX_PATH * 4];
  if (!JoinPath(manifestPath, _countof(manifestPath), steamApps, L"appmanifest_250900.acf")) {
    return false;
  }
  char* data = NULL;
  if (!ReadTextFileW(manifestPath, &data)) {
    return false;
  }
  char installDir[512];
  bool found = false;
  if (FindVdfValue(data, "installdir", installDir, sizeof(installDir))) {
    wchar_t wideInstallDir[512];
    if (Utf8ToWide(installDir, wideInstallDir, static_cast<int>(_countof(wideInstallDir)))) {
      NormalizePath(wideInstallDir);
      if (JoinPath(gameDir, _countof(gameDir), commonDir, wideInstallDir) &&
          JoinPath(exePath, _countof(exePath), gameDir, GAME_EXE_NAME) &&
          FileExistsW(exePath)) {
        wcscpy_s(g_gamePath, _countof(g_gamePath), exePath);
        found = true;
      }
    }
  }
  free(data);
  return found;
}

static bool FindSteamGame() {
  wchar_t steamPath[MAX_PATH * 4] = { 0 };
  bool foundSteamPath =
    ReadRegistryString(HKEY_CURRENT_USER, L"Software\\Valve\\Steam", L"SteamPath", steamPath, _countof(steamPath)) ||
    ReadRegistryString(HKEY_LOCAL_MACHINE, L"SOFTWARE\\WOW6432Node\\Valve\\Steam", L"InstallPath", steamPath, _countof(steamPath)) ||
    ReadRegistryString(HKEY_LOCAL_MACHINE, L"SOFTWARE\\Valve\\Steam", L"InstallPath", steamPath, _countof(steamPath));
  if (!foundSteamPath) {
    return false;
  }
  NormalizePath(steamPath);
  if (FindGameInLibrary(steamPath)) {
    return true;
  }
  wchar_t libraryFoldersPath[MAX_PATH * 4];
  if (!JoinPath(libraryFoldersPath, _countof(libraryFoldersPath), steamPath, L"steamapps\\libraryfolders.vdf")) {
    return false;
  }
  char* data = NULL;
  if (!ReadTextFileW(libraryFoldersPath, &data)) {
    return false;
  }
  const char* cursor = data;
  bool found = false;
  while ((cursor = strstr(cursor, "\"path\"")) != NULL) {
    char libraryUtf8[1024];
    if (FindVdfValue(cursor, "path", libraryUtf8, sizeof(libraryUtf8))) {
      wchar_t library[MAX_PATH * 4];
      if (Utf8ToWide(libraryUtf8, library, static_cast<int>(_countof(library)))) {
        NormalizePath(library);
        if (FindGameInLibrary(library)) {
          found = true;
          break;
        }
      }
    }
    cursor += 6;
  }
  free(data);
  return found;
}

static bool ContainsCaseInsensitive(const wchar_t* text, const wchar_t* needle) {
  size_t needleLength = wcslen(needle);
  if (needleLength == 0) {
    return false;
  }
  for (const wchar_t* cursor = text; *cursor != L'\0'; ++cursor) {
    if (_wcsnicmp(cursor, needle, needleLength) == 0) {
      return true;
    }
  }
  return false;
}

struct WindowSearch {
  DWORD processId;
};

static BOOL CALLBACK FindGameWindow(HWND window, LPARAM parameter) {
  if (!IsWindowVisible(window)) {
    return TRUE;
  }
  wchar_t title[512];
  if (GetWindowTextW(window, title, static_cast<int>(_countof(title))) == 0) {
    return TRUE;
  }
  if (!ContainsCaseInsensitive(title, L"isaac") && wcsstr(title, L"\u4ee5\u6492") == NULL) {
    return TRUE;
  }
  DWORD processId = 0;
  GetWindowThreadProcessId(window, &processId);
  if (processId == 0) {
    return TRUE;
  }
  WindowSearch* search = reinterpret_cast<WindowSearch*>(parameter);
  search->processId = processId;
  return FALSE;
}

static bool FindGameFromWindow() {
  WindowSearch search = { 0 };
  EnumWindows(FindGameWindow, reinterpret_cast<LPARAM>(&search));
  if (search.processId == 0) {
    return false;
  }
  HANDLE process = OpenProcess(PROCESS_QUERY_LIMITED_INFORMATION, FALSE, search.processId);
  if (process == NULL) {
    return false;
  }
  wchar_t exePath[MAX_PATH * 4];
  DWORD pathChars = static_cast<DWORD>(_countof(exePath));
  BOOL ok = QueryFullProcessImageNameW(process, 0, exePath, &pathChars);
  CloseHandle(process);
  if (!ok) {
    return false;
  }
  const wchar_t* fileName = wcsrchr(exePath, L'\\');
  if (fileName == NULL || _wcsicmp(fileName + 1, GAME_EXE_NAME) != 0) {
    return false;
  }
  wcscpy_s(g_gamePath, _countof(g_gamePath), exePath);
  return true;
}

static void PrintUtf8(const wchar_t* text) {
  int bytes = WideCharToMultiByte(CP_UTF8, 0, text, -1, NULL, 0, NULL, NULL);
  if (bytes <= 1) {
    return;
  }
  char* buffer = static_cast<char*>(malloc(bytes));
  if (buffer == NULL) {
    return;
  }
  WideCharToMultiByte(CP_UTF8, 0, text, -1, buffer, bytes, NULL, NULL);
  fwrite(buffer, 1, static_cast<size_t>(bytes - 1), stdout);
  fflush(stdout);
  free(buffer);
}

int main() {
  if (FindGameFromWindow()) {
    PrintUtf8(g_gamePath);
    return 0;
  }
  if (FindSteamGame()) {
    PrintUtf8(g_gamePath);
    return 0;
  }
  for (int attempt = 0; attempt < 120; ++attempt) {
    if (FindGameFromWindow()) {
      PrintUtf8(g_gamePath);
      return 0;
    }
    Sleep(500);
  }
  fputs("isaac-ng.exe not found\n", stderr);
  return 1;
}
