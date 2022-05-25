# Fragments
API server Setup

# Running WSL2
WSL2 is a Windows subsystem for Linux and can run various Windows commands using Linux architecture. to run it in terminal, simply install a distro through Microsoft Store and the latest version of WSL2 by following https://www.windowscentral.com/how-install-wsl2-windows-10. 
Command to use to launch WSL2: **wsl -d "distroName"**

# Instructions On How to Run The Following Strtup Scripts and Their Purpose:-
1- **npm run lint** | lint is responsible to run the program and analyse the code written by identifying possible errors found in the  code

2- **npm start** | start runs the json file of the project that it is reading from. 

3- **npm run dev** | running dev compiles the entire project that it is reading from and makes it possible to inspect potential errors in the dev tools feature in the console of a browser. All the changes are also viewable activly while npm run dev is running.

4- **npm run debug** | This script requires setup before it can be used which is connecting a debugger to the running process of the server. It will help debugging by passing the names of the functions. Refernce LAB01 https://github.com/humphd/cloud-computing-for-programmers-summer-2022/tree/main/labs/lab-01

	
