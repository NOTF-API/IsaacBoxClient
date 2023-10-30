#include <stdio.h>
#include <windows.h>
#include <tlhelp32.h>
#include <psapi.h>
#define GAME_FILE_NAME (L"isaac-ng.exe")

char exePath[MAX_PATH];

DWORD GetGameProcessId();
bool GetGameDirectory();
void PrintGameDirectorySync();
void KillGameProcess();


int main(int argc, char* argv[])
{
    if (argc <= 1)
    {
        return -1;
    }
    char* arg = argv[1];
    if (strcmp(arg, "-D") == 0) {
        PrintGameDirectorySync();
    }
    else if (strcmp(arg, "-K") == 0) {
        KillGameProcess();
    }
    return 0;
}

bool GetGameDirectory() {
    DWORD gamePID = GetGameProcessId();
    if (gamePID != 0) {
        HANDLE hProcess = OpenProcess(PROCESS_QUERY_INFORMATION | PROCESS_VM_READ, FALSE, gamePID);
        if (hProcess == NULL) {
            return false;
        }
        memset(exePath,0,sizeof(exePath));
        DWORD result = GetModuleFileNameExA(hProcess, NULL, exePath, MAX_PATH);
        CloseHandle(hProcess);
        return result != 0;
    }
    return false;
}

void PrintGameDirectorySync() {
    for (;;) {
        if (GetGameDirectory()) {
            printf("%s", exePath);
            break;
        }
        Sleep(1000);
    }
}

DWORD GetGameProcessId() {
	DWORD processId = 0;
	HANDLE snapshot = CreateToolhelp32Snapshot(TH32CS_SNAPPROCESS, 0);
	if (snapshot != INVALID_HANDLE_VALUE) { 
		PROCESSENTRY32 processEntry;
		processEntry.dwSize = sizeof(PROCESSENTRY32);
		if (Process32First(snapshot, &processEntry)) {
			do {
				if (wcscmp(processEntry.szExeFile, GAME_FILE_NAME) == 0) {
					processId = processEntry.th32ProcessID;
					break;
				}
			} while (Process32Next(snapshot, &processEntry));
		}
		CloseHandle(snapshot);
	}
	return processId;
}

void KillGameProcess() {
    // 获取游戏进程的PID
    DWORD gamePID = GetGameProcessId();
    if (gamePID == 0) {
        return;
    }

    // 打开游戏进程
    HANDLE hProcess = OpenProcess(PROCESS_TERMINATE, FALSE, gamePID);
    if (hProcess == NULL) {
        return;
    }

    // 终止游戏进程
    TerminateProcess(hProcess, 0);

    // 关闭进程句柄
    CloseHandle(hProcess);
}