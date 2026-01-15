import { Injectable } from "@nestjs/common";
import * as os from "os";
import * as nodeDiskInfo from "node-disk-info";

@Injectable()
export class ServerService {
    getCpuInfo() {
        const cpus = os.cpus();
        const cpuInfo = cpus.reduce(
            (info, cpu) => {
                info.cpuNum += 1;
                info.user += cpu.times.user;
                info.sys += cpu.times.sys;
                info.idle += cpu.times.idle;
                info.total += cpu.times.user + cpu.times.sys + cpu.times.idle;
                return info;
            },
            { user: 0, sys: 0, idle: 0, total: 0, cpuNum: 0 },
        );
        const cpu = {
            cpuNum: cpuInfo.cpuNum,
            sys: ((cpuInfo.sys / cpuInfo.total) * 100).toFixed(2),
            used: ((cpuInfo.user / cpuInfo.total) * 100).toFixed(2),
            free: ((cpuInfo.idle / cpuInfo.total) * 100).toFixed(2),
        };

        return cpu;
    }

    bytesToGB(bytes) {
        const gb = bytes / (1024 * 1024 * 1024);
        return gb.toFixed(2);
    }

    getMemInfo() {
        const totalMemory = os.totalmem();
        const freeMemory = os.freemem();
        const usedMemory = totalMemory - freeMemory;
        const memoryUsagePercentage = (
            ((totalMemory - freeMemory) / totalMemory) *
            100
        ).toFixed(2);
        const mem = {
            total: this.bytesToGB(totalMemory),
            used: this.bytesToGB(usedMemory),
            free: this.bytesToGB(freeMemory),
            usage: memoryUsagePercentage,
        };
        return mem;
    }

    async getDiskStatus() {
        const disks = await nodeDiskInfo.getDiskInfoSync();
        const sysFiles = disks.map((disk: any) => {
            return {
                dirName: disk._mounted,
                typeName: disk._filesystem,
                total: this.bytesToGB(disk._blocks) + "GB",
                used: this.bytesToGB(disk._used) + "GB",
                free: this.bytesToGB(disk._available) + "GB",
                usage: ((disk._used / disk._blocks || 0) * 100).toFixed(2),
            };
        });
        return sysFiles;
    }

    getServerIP() {
        const nets = os.networkInterfaces();
        for (const name of Object.keys(nets)) {
            for (const net of nets[name]) {
                if (net.family === "IPv4" && !net.internal) {
                    return net.address;
                }
            }
        }
    }

    getSysInfo() {
        return {
            computerName: os.hostname(),
            computerIp: this.getServerIP(),
            osName: os.platform(),
            osArch: os.arch(),
        };
    }
}
