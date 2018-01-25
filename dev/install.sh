#!/usr/bin/env bash

# Licensed to Datalayer (http://datalayer.io) under one or more
# contributor license agreements.  See the NOTICE file
# distributed with this work for additional information
# regarding copyright ownership. Datalayer licenses this file
# to you under the Apache License, Version 2.0 (the 
# "License"); you may not use this file except in compliance
# with the License.  You may obtain a copy of the License at
#
#   http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing,
# software distributed under the License is distributed on an
# "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
# KIND, either express or implied.  See the License for the
# specific language governing permissions and limitations
# under the License.

yarn install

# Fix @types/react

rm node_modules/@types/react-dom/node_modules/@types/react/*
cp node_modules/@types/react/* node_modules/@types/react-dom/node_modules/@types/react/

rm node_modules/@types/react-test-renderer/node_modules/@types/react/*
cp node_modules/@types/react/* node_modules/@types/react-test-renderer/node_modules/@types/react/

rm node_modules/@types/react-grid-layout/node_modules/@types/react/*
cp node_modules/@types/react/* node_modules/@types/react-grid-layout/node_modules/@types/react/
