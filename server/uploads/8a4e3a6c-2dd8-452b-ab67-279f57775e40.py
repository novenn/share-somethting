# -*- coding: UTF-8 -*-
# Auther: youren.S

import os
import shutil
import win32com
import win32com.client
# from win32com.client import constants
import time
from PIL import Image
import re
from tqdm import tqdm

ppt_app = win32com.client.Dispatch('PowerPoint.Application')
# ppt_app =  win32com.client.Dispatch('kwpp.Application')

# wc = win32com.client.constants
def output_file(fname, ppt_dir):
    """
    判断文件是否存在并生成图片保存目录
    :param ppt_path: ppt文件路径
    :return: 文件保存目录
    """
    output_path = ""
    
    output_path = os.path.join(ppt_dir, fname)
    if os.path.isdir(output_path):
        shutil.rmtree(output_path)
    os.mkdir(output_path)
    return output_path


def ppt2png(ppt_dir, ppt_file, long_sign: str):
    global ppt_app
    #ppt_name1, ppt_name2 = ppt_file.split(".")
    ppt_name1, ppt_name2 = os.path.splitext(ppt_file)

    file_ext = os.path.splitext(ppt_file)[1]

    # 判断文件后缀
    if file_ext != ".ppt" and file_ext != ".pptx":
        return
    

    ppt_dirfile = os.path.join(ppt_dir, ppt_name1)
    """
    ppt 转 png 方法
    :param ppt_path: ppt 文件的绝对路径
    :param long_sign: 是否需要转为生成长图的标识
    :return:
    """
    ppt_path = os.path.join(ppt_dir, ppt_file)
    if os.path.exists(ppt_path):
       
       
       
        ########### 保存全部页面为一个长图 #########
        output_path = output_file(ppt_name1.replace(".", "_") , ppt_dir) # 判断文件是否存在
        pngoutput = os.path.join(ppt_dir, ppt_name1+'.png')
        if os.path.exists(pngoutput) == False:
            if ppt_app == 0:
                
                ppt_app = win32com.client.Dispatch('PowerPoint.Application')
                # 设置为0表示后台运行，不显示，1则显示
                ppt_app.Visible = 1
                
            ppt = ppt_app.Presentations.Open(ppt_path)  # 打开 ppt
            ppSaveAsJPG = 17
            try:
                ppt.SaveAs(output_path, ppSaveAsJPG)  # 17表示 ppt 转为图片
            except Exception as e:
                print("解压并保存PPT失败")
                print(e)
            # ppt_app.Quit()  # 关闭资源，退出
            ppt.Close
           
            if 'Y' == long_sign.upper():
                try:
                    generate_long_image(output_path, ppt_name1)  # 合并生成长图
                except Exception as e:
                    print("合并长图失败")
                    print(e)
        shutil.rmtree(output_path)
        ########################################
        # pngoutput = os.path.join(ppt_dir, ppt_name1+'.png')
        # if os.path.exists(pngoutput) == False:
        #     ppt_app.Visible = 1
        #     ppt = ppt_app.Presentations.Open(ppt_path)  # 打开 ppt
        #     ppt.Slides[1].Export(pngoutput, "PNG")
        #     ppt.Close
        

    else:
        raise Exception('请检查文件是否存在！\n')


def generate_long_image(output_path, ppt_name1):
    """
    将ppt的各个页面拼接成长图
    :param output_path:
    :return:
    """
    picture_path = output_path
    last_dir = os.path.dirname(picture_path)  # 上一级文件目录

    # 获取图片列表
    # ims = [Image.open(os.path.join(picture_path, fn)) for fn in os.listdir(picture_path) if fn.endswith('.jpg')]

    ims = []
    for fn in os.listdir(picture_path):
        if fn.lower().endswith('.jpg'):
            ims.append(os.path.join(picture_path, fn))


    # 将获取到ppt的页面进行排序
    ims_sort = sorted(ims, key=lambda jpg: len(jpg))

    width, height = Image.open(ims[0]).size  # 取第一个图片尺寸
    long_canvas = Image.new(Image.open(ims[0]).mode, (width, height * len(ims)))  # 创建同宽，n倍高的空白图片

    # 拼接图片
    for i, image in enumerate(ims_sort):
        long_canvas.paste(Image.open(image), box=(0, i * height))
    long_canvas.save(os.path.join(last_dir, ppt_name1+'.png'))  # 保存长图

def task(path, long_sign):
    global ppt_app
    try:
        if ppt_app != 0:
            ppt_app.Quit()
        ppt_app = 0
    except:
        print(str(time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(time.time()))) + ": 关闭Powerport程序失败")
        # ppt_app = win32com.client.Dispatch('kwpp.Application')
    ppt_app = win32com.client.Dispatch('PowerPoint.Application')
    # ppt_app =  win32com.client.Dispatch('kwpp.Application')
    
    files = os.listdir(path)
    index = 0
    for cur_file in files:
        cur_path = os.path.join(path, cur_file)
        # 获取文件名和扩展名
        file_name, file_ext = os.path.splitext(cur_path)

        # 替换扩展名为 .jpg
        image_path = file_name + ".jpg"
        if os.path.exists(image_path):
            continue
        index = index + 1
        # if index % 20 == 0:
            # try:
                # ppt_app.Quit()
           #  except:
               #  print("Close Error")
            
            # time.sleep(2)
            
            # ppt_app = win32com.client.Dispatch('PowerPoint.Application')
            # ppt_app =  win32com.client.Dispatch('kwpp.Application')
            
       
        if os.path.isdir(cur_path):
           
            task(cur_path, long_sign)
            if ppt_app != 0:
                ppt_app.Quit()
            ppt_app = 0
        else:
            try:
                ppt2png(path, cur_file, long_sign)
                
                print(str(index) + " " + str(time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(time.time()))) + ": [SUCCESS] " + cur_path)
            except Exception as e:
                try:
                    if ppt_app != 0:
                        ppt_app.Quit()
                    ppt_app = 0
                except:
                    print("")
                print("")
                print(str(index) + " " + str(time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(time.time()))) + ": [FAILED]  " + cur_path)
                print(e)

if __name__ == '__main__':
    # # ppt_path = "test_template.pptx"
    cur_path = os.getcwd()
   
    ppt_path = os.path.join(cur_path, "./ppts")   # 需要使用绝对路径，否则会报错
    long_sign = "y"
    task(ppt_path, long_sign)
    # re_task(ppt_path, long_sign)
