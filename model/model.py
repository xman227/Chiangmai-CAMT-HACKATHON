from tensorflow.keras.models import load_model
import numpy as np # 데이터 배열 처리 라이브러리
import tensorflow as tf # 딥러닝 모델 형성 라이브러리
import sys
import os


# 모델 
script_path = os.path.abspath(__file__)
script_directory = os.path.dirname(script_path)

model_filename = 'CNN_for_plant.h5'
model_path = os.path.join(script_directory, model_filename)

loaded_model = load_model(model_path)


def decode_img(img):
    IMAGE_SIZE = [180, 180]
    #img = tf.image.decode_jpeg(img, channels=3) # 이미지를 uint8 tensor로 수정
    img = tf.image.decode_jpeg(img, channels=1)
    img = tf.image.convert_image_dtype(img, tf.float32) # float32 타입으로 수정
    img = tf.image.resize(img, IMAGE_SIZE) # 이미지 사이즈를 IMAGE_SIZE로 수정
    return img


def print_result(img):

    script_path = os.path.abspath(__file__)
    script_directory = os.path.dirname(script_path)

    img_filename = img
    img_path = os.path.join(script_directory, '../upload/', img_filename)
    return img_path
    img = tf.io.read_file(img_path) # 이미지로 받을 때
    img = decode_img(img)
    img_array = np.expand_dims(img, axis=0)  # 바로 받을 때 4차원으로 확장
    result = loaded_model.predict(img_array)[0][0]
    
    if result >= 0.87240:
        return 'Adult'
    else:
        return 'baby'

if __name__ == "__main__":
#     # 모델을 불러온 후 테스트 이미지로 결과 출력
    print('실행이 됨')
    image_paths = sys.argv[0] # 'file_1703211466859.png'
    #sys.argv 
    print_result(image_paths)
    
    #파이썬 스크립트에 tf 환경 조성