import { PALLETS, API_ENDPOINT } from '../../constants';
import React, { useState, useRef } from 'react';
import styled from '@emotion/styled';
import { useHistory, Link } from 'react-router-dom';
import axios from 'axios';

const ProductModificationPage = () => {
  const [image, setImgfile] = useState(null);
  const [imageSrc, setImageSrc] = useState('/assets/logo.png');
  const userToken = localStorage.getItem('Token');
  const userAccountname = localStorage.getItem('accountname');
  const handleChangeFile = (e) => {
    setImgfile(e.target.files);
    encodeFileToBase64(e.target.files[0]);
  };
  const encodeFileToBase64 = (fileBlob) => {
    const reader = new FileReader();
    reader.readAsDataURL(fileBlob);
    return new Promise((resolve) => {
      reader.onload = () => {
        setImageSrc(reader.result);
        resolve();
      };
    });
  };

  const itemName = useRef(null);
  const price = useRef(null);
  const link = useRef(null);
  const itemImage = useRef(null);

  async function imageUpload(files, index) {
    const formData = new FormData();
    formData.append('image', files[index]);
    const res = await fetch(`${API_ENDPOINT}/image/uploadfile`, {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    const productImgName = data['filename'];
    return productImgName;
  }

  const productPost = async (e) => {
    e.preventDefault();
    const imageUrls = [];
    const files = image;
    const url = `${API_ENDPOINT}`;
    if (files.length < 2) {
      for (let index = 0; index < files.length; index++) {
        const imgurl = await imageUpload(files, index);
        imageUrls.push(url + '/' + imgurl);
      }
      const res = await fetch(url + '/product', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${userToken}`,
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          product: {
            itemName: `${itemName.current.value}`,
            price: parseInt(price.current.value),
            link: `${link.current.value}`,
            itemImage: imageUrls + '',
          },
        }),
      });
      const json = await res.json();
      window.location.replace("/profile")
    }
  };
  const useInput = (initialValue, validator) => {
    const [value, setValue] = useState(initialValue);
    const onChange = (event) => {
      const {
        target: { value },
      } = event;
      let willUpdate = true;
      if (typeof validator === 'function') {
        willUpdate = validator(value);
      }
      if (willUpdate) {
        setValue(value);
      }
    };
    return { value, onChange };
  };
  const maxLen = (value) => value.length <= 15;
  const name = useInput('', maxLen);
  const maxPrice = (value) => value.length <= 8;
  const productPrice = useInput('', maxPrice);

  const isId = (e) => {
    const curValue = e.currentTarget.value;
  };
const [urlcheck, setUrlcheck] = useState('');
  const checkUrl = (e) => {
    var regExp = /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
    setUrlcheck(regExp.test(link));
}
let history = useHistory();
  return (
    <ModifiSec>
      <form>
        <ModificationHeads>
          <button
            id="btnBack"
            onClick={() => {
              history.goBack();
            }}
          ></button>
          <Link to="/profile">
            <button id="uploadBtn" onClick={productPost}>
              저장
            </button>
          </Link>
        </ModificationHeads>
        <section className="prod-modi-cont">
          <h1 className="sr-only">상품 수정 페이지 입니다.</h1>
          <div className="prod-picb-wrap">
            <h2 className="product-title">이미지 등록</h2>
            <img src={imageSrc} alt="상품 사진" id="product-cha-img" />
            <input
              id="product-cha-btn"
              className="product-change-inp"
              name="imgUpload"
              type="file"
              accept="image/*"
              ref={itemImage}
              onChange={handleChangeFile}
              required
            />
            <label
              htmlFor="product-cha-btn"
              className="product-change-btn"
            ></label>
          </div>
          <article className="prod-info-inpt">
            <label>
              <h3>상품명</h3>
              <input
                type="text"
                placeholder="1~15자 이내여야 합니다."
                className="inp-product-name"
                value={name.value}
                onChange={name.onChange}
                ref={itemName}
                required
              />
            </label>
            <label>
              <h3>가격</h3>
              <input
                type="number"
                placeholder="숫자만 입력 가능합니다."
                className="inp-product-price"
                required
                value={productPrice.value}
                onChange={productPrice.onChange}
                ref={price}
              />
            </label>
            <label>
              <h3>판매 링크</h3>
              <input
                type="text"
                placeholder="URL을 입력해 주세요."
                className="inp-product-link"
                required
                onChange={isId}
                onBlur={checkUrl}
                ref={link}
              />
              {urlcheck ? 
              <li className='urlcheck'> 정확한 url 값을 넣어주세요</li>: null
            }
            </label>
          </article>
        </section>
      </form>
    </ModifiSec>
  );
};
export default ProductModificationPage;

const ModifiSec = styled.section`
  .sr-only {
    position: absolute;
    overflow: hidden;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    border: 0;
    clip: rect(0, 0, 0, 0);
  }

  .prod-modi-cont {
    display: flex;
    flex-direction: column;
    justify-self: center;
    align-items: center;
    .prod-picb-wrap {
      position: relative;
      margin-top: 50px;
      .product-title {
        font-size: 12px;
        font-weight: 400;
      }
      img {
        width: 322px;
        height: 204px;
        border-radius: 10px;
        background-color: ${PALLETS.LIGHTGRAY};
      }
      .product-change-btn {
        width: 36px;
        height: 36px;
        position: absolute;
        bottom: 10px;
        right: 10px;
        background-image: url('/assets/upload-file.png');
        background-size: cover;
        cursor: pointer;
      }
    }
    .product-change-inp {
      width: 1px;
      height: 1px;
      opacity: 0;
    }
  }
  .prod-info-inpt {
    label {
      width: 322px;
      height: 48px;
    }
    input {
      margin-bottom: 16px;
      border: none;
      width: 322px;
      border-bottom: 1px solid ${PALLETS.LIGHTGRAY};
    }
    h3 {
      font-size: 12px;
      margin-top: 16px;
      margin-bottom: 10px;
    }
    .ms-button {
      position: absolute;
      right: 16px;
    }
  }
  .prod-info-inpt input::placeholder {
    color: ${PALLETS.LIGHTGRAY};
    font-size: 14px;
  }

  .prod-info-inpt .ms-button.disabled {
    display: none;
  }
  .ms-button.disabled.add {
    display: block;
  }
  .urlcheck{
    list-style: none;
    color: red;
    font-size: 13px;
    margin-top: -10px;
  }
`;

const ModificationHeads = styled.section`
  display: flex;
  justify-content: space-between;
  width: 100vw;
  height: 48px;
  padding: 13px 16px;
  border-bottom: 1px solid ${PALLETS.GRAY};
  #btnBack {
    background: url(/assets/icon/icon-arrow-left.png);
    width: 22px;
    height: 22px;
  }
  #uploadBtn {
    background-color: ${PALLETS.ORANGE};
    width: 100px;
    height: 28px;
    padding: 0 11px;
    border-radius: 26px;
    color: #fff;
    font-size: 12px;
    line-height: 18px;
    text-align: center;
    .disabled {
      background-color: ${PALLETS.BEIGE};
    }
  }
`;
